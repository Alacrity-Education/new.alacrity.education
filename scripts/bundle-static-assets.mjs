#!/usr/bin/env node
/**
 * Finishes the static export in out/ so it can be deployed on its own.
 *
 *   1. Media. Pages reference uploads by site-relative path
 *      (/api/media/file/…, see src/utilities/getMediaUrl.ts). Every file the
 *      export references is downloaded from the CMS once, here, and written to
 *      out/ at that same path — so the deployed site serves its own images and
 *      visitors never touch the CMS. Any absolute CMS media URL that slipped
 *      into the output is rewritten to the bundled copy.
 *   2. sitemap.xml, built from the HTML files the export actually produced.
 *   3. robots.txt, pointing at that sitemap.
 *
 * Fails the build if any referenced file cannot be fetched, rather than
 * publishing pages with broken images.
 *
 * Env: NEXT_PUBLIC_SITE_URL      public site, e.g. https://alacrity.education
 *      NEXT_PUBLIC_PAYLOAD_API_URL  CMS REST base, e.g. https://cms.alacrity.ro/api
 * Usage: node scripts/bundle-static-assets.mjs [outDir]
 */
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(process.argv[2] || 'out')
const trim = (u) => (u || '').replace(/\/+$/, '')
const SITE_URL = trim(process.env.NEXT_PUBLIC_SITE_URL)
const API_URL = trim(process.env.NEXT_PUBLIC_PAYLOAD_API_URL)

if (!SITE_URL || !API_URL) {
  console.error('NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_PAYLOAD_API_URL are both required')
  process.exit(1)
}

const CMS_ORIGIN = new URL(API_URL).origin
const MEDIA_PREFIX = '/api/media/file/'
// Up to the first character that cannot be part of a URL path in markup,
// srcset, inline CSS (&quot;) or an RSC payload. Query strings (cache tags)
// are dropped. Parentheses are allowed — uploads like "photo (2).jpg" exist —
// and an unbalanced trailing one, from a CSS url(…), is trimmed below.
const MEDIA_REF = /\/api\/media\/file\/([^"'\s?#\\<>,&]+)/g
const trimRef = (ref) => {
  while (ref.endsWith(')') && ref.split(')').length > ref.split('(').length) ref = ref.slice(0, -1)
  return ref
}
const SCRIPT = /<script\b[^>]*>([\s\S]*?)<\/script>/gi
// Payload names resized copies <name>-<width>x<height>.<ext>.
const GENERATED_SIZE = /-\d+x\d+\.[a-z0-9]+$/i
// Cloudflare Pages rejects any single file over 25 MiB.
const MAX_FILE_BYTES = 25 * 1024 * 1024
const TEXT_EXT = new Set(['.html', '.txt', '.json', '.js', '.css', '.xml'])
const UA = 'alacrity-static-build'

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// ── 1. Media ────────────────────────────────────────────────────────────────
const absoluteMedia = new RegExp(escapeRegExp(CMS_ORIGIN + MEDIA_PREFIX), 'g')
const refs = new Set()
const htmlFiles = []
let rewritten = 0

for await (const file of walk(OUT)) {
  const ext = path.extname(file)
  if (!TEXT_EXT.has(ext)) continue
  if (ext === '.html') htmlFiles.push(file)

  let text = await readFile(file, 'utf8')
  if (text.includes(CMS_ORIGIN + MEDIA_PREFIX)) {
    text = text.replace(absoluteMedia, MEDIA_PREFIX)
    await writeFile(file, text)
    rewritten++
  }
  // React's serialized page data — the .txt files, and the same payload inlined
  // in each HTML file's <script> tags — carries whole media objects, original
  // URL included, whether or not anything displays it. What is displayed is in
  // the HTML markup (every page is exported as HTML) or is one of Payload's
  // resized copies (getDisplayMediaUrl). From the data, only resized copies are
  // taken; untouched originals would add hundreds of MB nobody downloads.
  let markup = text
  let data = ''
  if (ext === '.txt') {
    markup = ''
    data = text
  } else if (ext === '.html') {
    data = [...text.matchAll(SCRIPT)].map((m) => m[1]).join('\n')
    markup = text.replace(SCRIPT, '')
  }
  for (const m of markup.matchAll(MEDIA_REF)) refs.add(trimRef(m[1]))
  for (const m of data.matchAll(MEDIA_REF)) {
    const ref = trimRef(m[1])
    if (GENERATED_SIZE.test(ref)) refs.add(ref)
  }
}

let bytes = 0
const failures = []
const queue = [...refs]
const fetchOne = async (ref) => {
  let name
  try {
    name = decodeURIComponent(ref)
  } catch {
    name = ref
  }
  if (name.includes('..') || name.includes('/')) {
    failures.push(`${ref}: unexpected path`)
    return
  }
  const res = await fetch(CMS_ORIGIN + MEDIA_PREFIX + encodeURIComponent(name), {
    headers: { 'User-Agent': UA },
  })
  if (!res.ok) {
    failures.push(`${ref}: HTTP ${res.status}`)
    return
  }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length > MAX_FILE_BYTES) {
    failures.push(`${name}: ${(buf.length / 1048576).toFixed(1)} MiB, over the 25 MiB Pages limit`)
    return
  }
  const dest = path.join(OUT, MEDIA_PREFIX, name)
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, buf)
  bytes += buf.length
}
await Promise.all(
  Array.from({ length: 8 }, async () => {
    for (let ref = queue.shift(); ref; ref = queue.shift()) await fetchOne(ref)
  }),
)

console.log(
  `media: ${refs.size} files, ${(bytes / 1e6).toFixed(1)} MB bundled` +
    (rewritten ? `; absolute CMS URLs rewritten in ${rewritten} files` : ''),
)
if (failures.length) {
  console.error(`::error::${failures.length} media files could not be bundled:`)
  for (const f of failures) console.error(`  ${f}`)
  process.exit(1)
}

// ── 2. Sitemap ──────────────────────────────────────────────────────────────
// Pages that exist but should not be listed: error pages, search results
// (noindex, see src/app/(frontend)/search/page.tsx), the placeholder post an
// empty posts collection exports (src/app/(frontend)/posts/[slug]/page.tsx)
// and the first archive page, whose canonical is /posts.
const UNLISTED = new Set(['/404', '/_not-found', '/search', '/posts/no-posts', '/posts/page/1'])

const lastmod = new Map()
for (const [collection, prefix] of [
  ['pages', '/'],
  ['posts', '/posts/'],
]) {
  try {
    const res = await fetch(
      `${API_URL}/${collection}?limit=0&depth=0&select[slug]=true&select[updatedAt]=true&where[_status][equals]=published`,
      { headers: { 'User-Agent': UA } },
    )
    const { docs = [] } = await res.json()
    for (const d of docs) {
      const p = collection === 'pages' && d.slug === 'home' ? '/' : prefix + d.slug
      lastmod.set(p, d.updatedAt)
    }
  } catch (err) {
    console.warn(`sitemap: no lastmod for ${collection} (${err.message})`)
  }
}

const urls = htmlFiles
  .map((f) => {
    let p = '/' + path.relative(OUT, f).split(path.sep).join('/')
    p = p.replace(/\.html$/, '').replace(/\/index$/, '') || '/'
    return p === '/index' ? '/' : p
  })
  .filter((p) => !UNLISTED.has(p))
  .sort()

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((p) => {
    const loc = xmlEscape(SITE_URL + (p === '/' ? '/' : encodeURI(p)))
    const mod = lastmod.get(p)
    return `  <url><loc>${loc}</loc>${mod ? `<lastmod>${mod}</lastmod>` : ''}</url>`
  }),
  '</urlset>',
  '',
].join('\n')
await writeFile(path.join(OUT, 'sitemap.xml'), sitemap)
console.log(`sitemap: ${urls.length} URLs`)

// ── 3. robots.txt ───────────────────────────────────────────────────────────
await writeFile(
  path.join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
)

// A sanity floor: an export that bundled nothing almost certainly built
// against an empty or unreachable API.
const outStat = await stat(path.join(OUT, 'index.html')).catch(() => null)
if (!outStat) {
  console.error('::error::out/index.html missing')
  process.exit(1)
}

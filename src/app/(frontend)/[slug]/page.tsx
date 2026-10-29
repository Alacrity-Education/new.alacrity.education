import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import type { RequiredDataFromCollectionSlug } from 'payload'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PageTransition } from '@/components/PageTransition'
import { heroTransitionName } from '@/components/PageTransition/names'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PageBackground } from '@/components/PageBackground'
import { data } from '@/data'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { IS_STATIC_EXPORT } from '@/utilities/buildTarget'
import { isDraftEnabled } from '@/utilities/draft'

/**
 * The export prerenders every published page; the server build prerenders
 * none. Returning [] there keeps `next build` off the database — the routes
 * render on demand instead, which is what the layout's force-dynamic says.
 */
export async function generateStaticParams() {
  if (!IS_STATIC_EXPORT) return []

  const pages = await data.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })

  return (
    pages.docs?.filter((doc) => doc.slug !== 'home').map(({ slug }) => ({ slug })) ?? []
  )
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {

  const draft = await isDraftEnabled()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout, background } = page
  const bgMedia = background?.image
  const bgUrl =
    typeof bgMedia === 'object' && bgMedia !== null
      ? getMediaUrl(bgMedia.url, bgMedia.updatedAt)
      : null

  const hasHero = Boolean(hero?.type && hero.type !== 'none')

  return (
    // Keyed by slug: one page to another is a page leaving and a page arriving.
    <PageTransition key={decodedSlug}>
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {bgUrl && <PageBackground url={bgUrl} opacity={background?.opacity ?? 10} />}

      {/* The name a clicked card takes on to open into this hero. Held in a
          custom property and only applied while a transition runs (see
          .vt-hero in globals.css), so outside one the wrapper is an ordinary
          div — no stacking context to change how the hero layers. */}
      {hasHero && (
        <div
          className="vt-hero"
          style={{ '--vt-hero-name': heroTransitionName(decodedSlug) } as React.CSSProperties}
        >
          <RenderHero hero={hero} />
        </div>
      )}
      <RenderBlocks blocks={layout} />
    </article>
    </PageTransition>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const draft = await isDraftEnabled()

  const result = await data.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

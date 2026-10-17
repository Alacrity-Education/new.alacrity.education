import { connection } from 'next/server'

import { IS_STATIC_EXPORT } from '@/utilities/buildTarget'

/**
 * Opt a route out of prerendering — in the server build only.
 *
 * This replaces the root layout's old `export const dynamic = 'force-dynamic'`.
 * That could not be made conditional: Next parses route segment config out of
 * the source at compile time and rejects anything but a literal, so there is
 * no expression that says "dynamic here, static there". Awaiting `connection()`
 * says the same thing at runtime, and a plain `if` can skip it.
 *
 * Why the server build wants it: every page here reads from Payload, so
 * prerendering would make `next build` need a live database — and the image is
 * built in CI, which has no route into one. The data is still cached;
 * getCachedGlobal/getCachedDocument/getRedirects wrap their queries in
 * unstable_cache with tags, and the collections' afterChange hooks call
 * revalidateTag on publish, so a request only reaches Postgres once the cache
 * for that tag has been busted.
 *
 * Why the static build does not: prerendering against the remote API is the
 * entire build. Here this is a no-op, and NEXT_PUBLIC_BUILD_TARGET is inlined
 * at build time, so the call is dropped rather than left in — `connection()`
 * in an exported route would fail the build.
 */
export const requireServerRender = async (): Promise<void> => {
  if (IS_STATIC_EXPORT) return

  await connection()
}

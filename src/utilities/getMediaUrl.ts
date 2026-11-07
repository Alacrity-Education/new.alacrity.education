import { getClientSideURL, getSiteURL } from '@/utilities/getURL'
import { IS_STATIC_EXPORT } from '@/utilities/buildTarget'
import type { Media } from '@/payload-types'

/**
 * Origin that serves uploaded media.
 *
 * The API returns media URLs relative to the Payload instance that served them
 * (e.g. `/api/media/file/photo.jpg`). When the frontend reads from a remote
 * Payload instance, those paths have to resolve against that instance's origin
 * — resolving them against the site's own origin (which is what a relative URL
 * does) points at a host that has no media.
 */
const getMediaOrigin = (): string => {
  const apiURL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL

  if (apiURL) {
    try {
      return new URL(apiURL).origin
    } catch {
      // Malformed value — fall back to the site origin below.
    }
  }

  return getClientSideURL()
}

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // The static export ships its own copy of every file it references
  // (scripts/bundle-static-assets.mjs copies them into out/ at the same path),
  // so the site serves its images itself and never fetches them from the CMS.
  const baseUrl = IS_STATIC_EXPORT ? '' : getMediaOrigin()
  return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`
}

/**
 * Absolute media URL on the public website, for places that need a full
 * address and are read by other hosts — social images in particular. The
 * static export carries the file at the same path (see above).
 */
export const getPublicMediaUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${getSiteURL()}${url.startsWith('/') ? '' : '/'}${url}`
}

/** Largest first; see the Media collection's imageSizes. */
const DISPLAY_SIZES = ['xlarge', 'large', 'medium', 'small'] as const

/**
 * URL to display an uploaded image at.
 *
 * The server build hands the original to Next's image optimiser, which
 * resizes it per request. The static export has no optimiser, so the original
 * itself would be served — camera files of 20–30 MB, which is too heavy for a
 * page and over Cloudflare Pages' 25 MiB file limit. There the largest size
 * Payload generated on upload (1920px wide at most) is used instead.
 */
export const getDisplayMediaUrl = (
  resource: Pick<Media, 'url' | 'sizes' | 'updatedAt'>,
): string => {
  let url = resource.url
  if (IS_STATIC_EXPORT) {
    for (const key of DISPLAY_SIZES) {
      const sized = resource.sizes?.[key]?.url
      if (sized) {
        url = sized
        break
      }
    }
  }
  return getMediaUrl(url, resource.updatedAt)
}

/** Width-only sizes, smallest first: the ones that keep the image's shape. */
const RESPONSIVE_SIZES = ['thumbnail', 'small', 'medium', 'large', 'xlarge'] as const

/**
 * `src` and `srcSet` for an uploaded image on the static site, which has no
 * image optimiser: the browser picks the smallest generated size that covers
 * the slot, given a `sizes` hint, instead of every visitor downloading 1920px.
 * Returns null in the server build (Next's optimiser does this there) and for
 * uploads without generated sizes.
 */
export const getResponsiveImage = (
  resource: Pick<Media, 'url' | 'sizes' | 'updatedAt' | 'width'>,
): { src: string; srcSet: string } | null => {
  if (!IS_STATIC_EXPORT) return null

  const candidates = RESPONSIVE_SIZES.flatMap((key) => {
    const size = resource.sizes?.[key]
    return size?.url && size.width ? [{ url: size.url, width: size.width }] : []
  })
  if (candidates.length === 0) return null

  // A size equal to an earlier one's width adds nothing (Payload skips
  // enlarging, so small uploads can repeat their own width).
  const seen = new Set<number>()
  const unique = candidates.filter((c) => !seen.has(c.width) && seen.add(c.width))

  return {
    src: getMediaUrl(unique[unique.length - 1]!.url, resource.updatedAt),
    srcSet: unique.map((c) => `${getMediaUrl(c.url, resource.updatedAt)} ${c.width}w`).join(', '),
  }
}

import { getClientSideURL } from '@/utilities/getURL'

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

  // Otherwise prepend the origin that serves media
  const baseUrl = getMediaOrigin()
  return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`
}

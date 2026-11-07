import canUseDOM from './canUseDOM'

/** `https://x.y/` and `https://x.y` name the same origin; joins add the slash. */
const trimSlash = (url: string) => url.replace(/\/+$/, '')

/**
 * Origin of this deployment: the CMS container in the server build, or
 * whatever NEXT_PUBLIC_SERVER_URL says in the static one.
 */
export const getServerSideURL = () => {
  return trimSlash(
    process.env.NEXT_PUBLIC_SERVER_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000'),
  )
}

/**
 * The public website, e.g. https://alacrity.education — the one address
 * search engines should know. Canonical links, og:url, social images and the
 * sitemap all use it, whichever host actually served the page: the same pages
 * are reachable on the CMS host and on *.pages.dev, and both point here.
 */
export const getSiteURL = () => {
  return trimSlash(process.env.NEXT_PUBLIC_SITE_URL || getServerSideURL())
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return trimSlash(process.env.NEXT_PUBLIC_SERVER_URL || '')
}

/**
 * Base of the Payload REST API, `/api` included. The static site has no API of
 * its own, so anything that talks to Payload — reads and form submissions
 * alike — goes to NEXT_PUBLIC_PAYLOAD_API_URL there; the server build serves
 * the API itself and falls back to its own origin.
 */
export const getPayloadAPIURL = () => {
  return trimSlash(process.env.NEXT_PUBLIC_PAYLOAD_API_URL || `${getClientSideURL()}/api`)
}

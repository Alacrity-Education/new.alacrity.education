/**
 * Names shared by the page and the click handler, so a card and the hero it
 * opens into agree on what to call themselves. Deliberately not in a
 * 'use client' module: a plain value exported from one is a client reference
 * in a server component, not the value.
 */

/** The page a same-origin path points at, or null if it isn't a page route. */
export const slugFromPath = (pathname: string): string | null => {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return 'home'
  if (parts.length === 1) return decodeURIComponent(parts[0])
  return null
}

/** A view-transition-name has to be a CSS identifier; slugs mostly are already. */
export const heroTransitionName = (slug: string): string => `hero-${slug.replace(/[^\w-]/g, '_')}`

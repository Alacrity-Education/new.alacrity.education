/**
 * Wrapper every direct child of CardScroller needs, so snapping applies.
 *
 * It lives in its own module, not in CardScroller.tsx, because that file is
 * `'use client'`. A server component importing a plain value from a client
 * module does not get the value: Next replaces the module with client
 * reference proxies, so this arrived at the card blocks as an object rather
 * than a string, `cn()` dropped it, and the cards rendered with no
 * scroll-snap-align at all. Mandatory snapping with nothing to snap to does
 * nothing, which is exactly how it behaved.
 */
export const cardScrollerItem = 'shrink-0 snap-start'

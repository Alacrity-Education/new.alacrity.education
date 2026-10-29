/**
 * The address a click leads to when it is a plain click on a link to another
 * page of this site, otherwise null: new tab, download, other site, the page
 * already open, modifier keys, or a click a drag-to-scroll row is about to
 * swallow (see CardScroller's data-swallow-click).
 */
export const pageLinkTarget = (e: MouseEvent): URL | null => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null

  const target = e.target as Element | null
  // Listeners on the document run before the row's own, so the row has to say
  // so in the DOM: a drag that ended on a card is not a click on it.
  if (target?.closest?.('[data-swallow-click]')) return null

  const a = target?.closest?.('a')
  if (!a || !a.href || (a.target && a.target !== '_self') || a.hasAttribute('download')) return null

  const url = new URL(a.href, window.location.href)
  if (url.origin !== window.location.origin) return null
  if (url.pathname === window.location.pathname) return null
  return url
}

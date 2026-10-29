/**
 * The address a click leads to when it is a plain click on a link to another
 * page of this site, otherwise null: new tab, download, other site, the page
 * already open, or modifier keys.
 */
export const pageLinkTarget = (e: MouseEvent): URL | null => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null

  const a = (e.target as Element | null)?.closest?.('a')
  if (!a || !a.href || (a.target && a.target !== '_self') || a.hasAttribute('download')) return null

  const url = new URL(a.href, window.location.href)
  if (url.origin !== window.location.origin) return null
  if (url.pathname === window.location.pathname) return null
  return url
}

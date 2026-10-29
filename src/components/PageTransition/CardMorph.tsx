'use client'

import { useEffect } from 'react'

import { heroTransitionName, slugFromPath } from './names'

/**
 * Names the card a visitor clicks after the page it links to, so the card
 * opens into that page's hero (see the `.vt-hero` wrapper in [slug]/page.tsx).
 *
 * Only the clicked card is named, and only at click time. Naming cards up
 * front would put the same name on every card that links to the same page —
 * the Lab page has nine pointing at one — and two elements with one name make
 * the browser abandon the whole transition, not just the morph.
 *
 * Capture phase, so this runs before Next's <Link> starts the navigation.
 */
export const CardMorph: React.FC = () => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // A name left behind by a click that never navigated — new tab,
      // external link — would collide with the next one. Clear first.
      document.querySelectorAll<HTMLElement>('[data-vt-card]').forEach((el) => {
        el.style.viewTransitionName = ''
      })

      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      const card = anchor?.closest<HTMLElement>('[data-vt-card]')
      if (!anchor || !card) return
      if (anchor.target && anchor.target !== '_self') return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return

      const to = slugFromPath(url.pathname)
      // A card linking to the page it sits on would share a name with that
      // page's own hero.
      if (!to || to === slugFromPath(window.location.pathname)) return

      card.style.viewTransitionName = heroTransitionName(to)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}

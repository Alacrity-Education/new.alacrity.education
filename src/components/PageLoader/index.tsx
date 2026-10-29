'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { RAVEN_EYE, RAVEN_STROKE_WIDTH, RAVEN_VIEWBOX } from '@/components/Logo/RavenMark'
import { RAVEN_STEPS, RAVEN_STROKES } from '@/components/Logo/ravenDrawing'
import { pageLinkTarget } from '@/utilities/pageLinkTarget'
import { cn } from '@/utilities/ui'

/** How long the cover takes to close over the page; the next page opens after it. */
const COVER_MS = 220
/**
 * The shortest time the loader stays up, counted from the click. Pages are
 * usually prefetched and open at once, so without this it would never be seen.
 */
const HOLD_MS = 850
/** If a navigation never finishes, the loader gives up and gets out of the way. */
const GIVE_UP_MS = 10000
/**
 * The raven, first stroke to last. Short of HOLD_MS so the finished drawing is
 * on screen for a moment before the cover lifts.
 */
const DRAW_MS = 620
/** The drawing advances one breadth-first step at a time... */
const STEP_MS = DRAW_MS / RAVEN_STEPS
/** ...and each stroke takes a little longer than a step, so they overlap. */
const STROKE_MS = STEP_MS * 1.8

const isPostsList = (path: string) => path === '/posts' || path.startsWith('/posts/page/')

/**
 * Hops that open straight away, without the loader: opening search, and paging
 * through the posts list, which only swaps the list on what is the same page.
 */
const isQuickHop = (from: string, to: string) =>
  to === '/search' || (isPostsList(from) && isPostsList(to))

/** Files, the API, the admin and the server-only routes. */
const isNotAPage = (path: string) =>
  /\.[a-z0-9]+$/i.test(path) || /^\/(api|admin|next)(\/|$)/.test(path)

/**
 * Between pages, the area under the header covers over and the raven from the
 * logo draws itself: outward from the tip of its beak, breadth first, each
 * stroke starting where the drawing reaches it (see Logo/ravenDrawing). A
 * click on a link to another page covers the current one first, then
 * opens the next, and the cover lifts once the new page is there and it has
 * been up for HOLD_MS. After mehstudios.net's loader.
 *
 * Named for view transitions (see globals.css): the page lift draws moving
 * content in a layer above the whole page, which would otherwise put the new
 * page on top of this cover for the length of the lift.
 *
 * Quick hops, links to files, and visitors who prefer reduced motion skip it.
 */
export const PageLoader: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  // The page a navigation started from; the loader shows until the address moves on.
  const [leaving, setLeaving] = useState<string | null>(null)
  const [holding, setHolding] = useState(false)
  // Bumped per navigation: re-keys the drawing so it starts again from nothing.
  const [run, setRun] = useState(0)
  const timers = useRef<number[]>([])

  // Arrived and held long enough: done, so going back to that page later shows nothing.
  if (leaving !== null && leaving !== pathname && !holding) setLeaving(null)
  const loading = leaving !== null && (leaving === pathname || holding)

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    }
    const onClick = (e: MouseEvent) => {
      const url = pageLinkTarget(e)
      if (!url || isNotAPage(url.pathname)) return
      if (isQuickHop(window.location.pathname, url.pathname)) return
      // Visitors who ask for less motion get the page at once, without the cosmetic wait.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Capture phase, before Next's <Link> handles it: this takes over the navigation.
      e.preventDefault()
      e.stopPropagation()
      const href = url.pathname + url.search + url.hash
      router.prefetch(href)
      clear()
      setRun((r) => r + 1)
      setLeaving(window.location.pathname)
      setHolding(true)
      timers.current = [
        window.setTimeout(() => router.push(href), COVER_MS),
        window.setTimeout(() => setHolding(false), HOLD_MS),
        window.setTimeout(() => setLeaving(null), GIVE_UP_MS),
      ]
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      clear()
    }
  }, [router])

  return (
    <div
      aria-hidden={!loading}
      role="status"
      style={{ viewTransitionName: 'page-loader' }}
      className={cn(
        'pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-base-100 text-primary transition-opacity ease-in-out',
        loading ? 'opacity-100 duration-200' : 'opacity-0 duration-500',
      )}
    >
      <span className="sr-only">{loading ? 'Loading page' : ''}</span>
      <svg
        key={run}
        viewBox={RAVEN_VIEWBOX}
        className={cn(
          'h-[150px] w-auto overflow-visible transition-[scale,opacity] ease-out motion-reduce:transition-none',
          // The cover closes quickly; the raven then fades in while growing a
          // little, and settles back as it fades out.
          loading ? 'scale-100 opacity-100 duration-700' : 'scale-[0.9] opacity-0 duration-500',
        )}
        fill="none"
        aria-hidden
      >
        {RAVEN_STROKES.map(({ d, depth }, i) => (
          <path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth={RAVEN_STROKE_WIDTH * 1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            // A dash the length of the stroke, pushed off it and slid back on:
            // the stroke draws from its start, which is the end the walk
            // arrived at.
            pathLength={1}
            strokeDasharray="1 2"
            style={{
              animation: `raven-draw ${STROKE_MS}ms cubic-bezier(0.3, 0.6, 0.4, 1) ${depth * STEP_MS}ms both`,
            }}
          />
        ))}
        <path
          d={RAVEN_EYE}
          fill="currentColor"
          style={{ animation: `raven-eye 220ms ease-out ${DRAW_MS}ms both` }}
        />
      </svg>
    </div>
  )
}

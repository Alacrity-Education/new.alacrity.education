'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import { RAVEN_EYE, RAVEN_STROKE_WIDTH, RAVEN_VIEWBOX } from '@/components/Logo/RavenMark'
import { RAVEN_STEPS, RAVEN_STROKES } from '@/components/Logo/ravenDrawing'
import { pageLinkTarget } from '@/utilities/pageLinkTarget'
import { cn } from '@/utilities/ui'

/**
 * A navigation that has not arrived by now gets the loader. A page that is
 * already prefetched or cached arrives within a frame or two, so in practice
 * only a page that is genuinely slow to fetch or render is ever covered.
 */
const SHOW_AFTER_MS = 300
/** Once up, the loader stays at least this long, so it can never flicker. */
const MIN_SHOWN_MS = 600
/** A navigation that never arrives: get out of the way rather than cover the page for good. */
const GIVE_UP_MS = 8000

/** The raven, first stroke to last. */
const DRAW_MS = 620
/** The drawing advances one breadth-first step at a time... */
const STEP_MS = DRAW_MS / RAVEN_STEPS
/** ...and each stroke takes a little longer than a step, so they overlap. */
const STROKE_MS = STEP_MS * 1.8
/** One loop on a long wait: draw, hold the finished raven, clear, draw again. */
const CYCLE_MS = 1800
/** Where in the loop the finished raven starts to clear. */
const CLEAR_AT = 0.85

/** Files, the API, the admin and the server-only routes: not client navigations. */
const isNotAPage = (path: string) =>
  /\.[a-z0-9]+$/i.test(path) || /^\/(api|admin|next)(\/|$)/.test(path)

type Pending = { from: string; timer?: number; shownAt?: number }

/**
 * A loading screen for navigations that keep you waiting. Next.js's own
 * answer, loading.tsx, does not work in a static export, and useLinkStatus
 * only works inside each <Link>; this is the same idea applied once, for
 * every link: the navigation runs untouched, and if the next page has not
 * arrived after SHOW_AFTER_MS, the area under the header covers over while the
 * raven from the logo draws itself, breadth first from the tip of its hat
 * (see Logo/ravenDrawing), on a loop until the page is there.
 *
 * "Arrived" is the address changing, which with the App Router happens when
 * the new page has been fetched and rendered — Next keeps the old page up
 * until then. Images and the like that stream in after have their own
 * placeholders.
 *
 * Listens in the bubble phase, after Next's <Link> has started the
 * navigation. That also leaves out the click a drag-to-scroll row swallows
 * (CardScroller), since it stops propagating before reaching the document.
 *
 * Named for view transitions (see globals.css): the page lift draws moving
 * content above the whole page, which would otherwise put the arriving page
 * over this cover. Visitors who prefer reduced motion never see it.
 */
export const PageLoader: React.FC = () => {
  const pathname = usePathname()
  const [shown, setShown] = useState(false)
  const pending = useRef<Pending | null>(null)
  const svg = useRef<SVGSVGElement>(null)

  // Arrival: the address has moved on from where the navigation started.
  useEffect(() => {
    const p = pending.current
    if (!p || p.from === pathname) return
    window.clearTimeout(p.timer)
    pending.current = null
    // Arrived before the loader was needed: nothing was ever shown.
    if (p.shownAt === undefined) return
    const t = window.setTimeout(
      () => setShown(false),
      Math.max(0, MIN_SHOWN_MS - (performance.now() - p.shownAt)),
    )
    return () => window.clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const url = pageLinkTarget(e)
      if (!url || isNotAPage(url.pathname)) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      window.clearTimeout(pending.current?.timer)
      const from = window.location.pathname
      const p: Pending = { from }
      p.timer = window.setTimeout(() => {
        if (window.location.pathname !== from) return
        p.shownAt = performance.now()
        setShown(true)
        p.timer = window.setTimeout(() => {
          if (pending.current === p) pending.current = null
          setShown(false)
        }, GIVE_UP_MS)
      }, SHOW_AFTER_MS)
      pending.current = p
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      window.clearTimeout(pending.current?.timer)
    }
  }, [])

  // The drawing, on a loop while the loader is up. Web Animations rather than
  // CSS because each step needs its own place in a shared loop, and CSS cannot
  // put a variable in a keyframe offset.
  useEffect(() => {
    if (!shown || !svg.current) return
    const draw = 'cubic-bezier(0.3, 0.6, 0.4, 1)'
    const anims = [...svg.current.querySelectorAll<SVGPathElement>('path[data-depth]')].map((el) => {
      const start = (Number(el.dataset.depth) * STEP_MS) / CYCLE_MS
      const end = Math.min(start + STROKE_MS / CYCLE_MS, CLEAR_AT)
      return el.animate(
        [
          { offset: 0, strokeDashoffset: 1, opacity: 0 },
          { offset: start, strokeDashoffset: 1, opacity: 0 },
          // Visible only once it starts, or the round cap at its start shows as a dot early.
          { offset: Math.min(start + 0.002, end), strokeDashoffset: 1, opacity: 1, easing: draw },
          { offset: end, strokeDashoffset: 0, opacity: 1 },
          { offset: CLEAR_AT, strokeDashoffset: 0, opacity: 1 },
          { offset: 1, strokeDashoffset: 0, opacity: 0 },
        ],
        { duration: CYCLE_MS, iterations: Infinity },
      )
    })
    const eye = svg.current.querySelector<SVGPathElement>('path[data-eye]')
    const eyeIn = DRAW_MS / CYCLE_MS
    if (eye) {
      anims.push(
        eye.animate(
          [
            { offset: 0, opacity: 0 },
            { offset: eyeIn, opacity: 0 },
            { offset: eyeIn + 0.08, opacity: 1 },
            { offset: CLEAR_AT, opacity: 1 },
            { offset: 1, opacity: 0 },
          ],
          { duration: CYCLE_MS, iterations: Infinity },
        ),
      )
    }
    // Stopped only after the cover has faded out, so the raven doesn't snap
    // to fully drawn as it goes.
    return () => {
      window.setTimeout(() => anims.forEach((a) => a.cancel()), 600)
    }
  }, [shown])

  return (
    <div
      aria-hidden={!shown}
      role="status"
      style={{ viewTransitionName: 'page-loader' }}
      className={cn(
        'pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-base-100 text-primary transition-opacity ease-in-out',
        shown ? 'opacity-100 duration-200' : 'opacity-0 duration-500',
      )}
    >
      <span className="sr-only">{shown ? 'Loading page' : ''}</span>
      <svg
        ref={svg}
        viewBox={RAVEN_VIEWBOX}
        className={cn(
          'h-[150px] w-auto overflow-visible transition-[scale,opacity] ease-out',
          // Fades in while growing a little, and settles back as it fades out.
          shown ? 'scale-100 opacity-100 duration-500' : 'scale-[0.9] opacity-0 duration-500',
        )}
        fill="none"
        aria-hidden
      >
        {RAVEN_STROKES.map(({ d, depth }, i) => (
          <path
            key={i}
            d={d}
            data-depth={depth}
            stroke="currentColor"
            strokeWidth={RAVEN_STROKE_WIDTH * 1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            // A dash the length of the stroke, pushed off it and slid back on:
            // the stroke draws from its start, which is the end the walk
            // arrived at.
            pathLength={1}
            strokeDasharray="1 2"
          />
        ))}
        <path data-eye d={RAVEN_EYE} fill="currentColor" />
      </svg>
    </div>
  )
}

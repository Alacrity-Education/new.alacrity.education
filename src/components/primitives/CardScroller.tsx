'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/** Below this many pixels a drag is a click that wobbled, not a drag. */
const DRAG_THRESHOLD = 5

/** Tailwind's `sm`. Below it a card is centred rather than aligned left. */
const MOBILE_QUERY = '(max-width: 39.99rem)'

/**
 * Horizontal card scroller, shared by the card and person-card sections.
 *
 * It is not wrapped in a container: `.bleed-row` gives it the page's full
 * width while padding its start out to where container content begins, so the
 * row lines up with the heading above it at rest and runs to the screen edge
 * only once scrolled. Rendering it inside a container instead would clip the
 * cards at the gutter, which reads as a row cut off mid-card.
 *
 * Children must carry `cardScrollerItem`, which is what gives them a snap
 * point — see that module for why it is not declared here.
 *
 * Snapping is `snap-start` against a matching `scroll-padding`, not
 * `snap-center`: the first and last card have nothing to centre against and
 * settle partly out of view. Below sm the padding is widened instead — see
 * centreOnMobile — which centres the cards without changing the alignment, so
 * the first and last still behave.
 */
export const CardScroller: React.FC<{
  children: React.ReactNode
  className?: string
  /** Gap between cards. Overridable for sections that space differently. */
  gapClassName?: string
}> = ({ children, className, gapClassName = 'gap-6 md:gap-8' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startX: number; startLeft: number; moved: boolean } | null>(null)
  // Whether the row overflows at all (no arrows when every card fits), and
  // which way it can still move.
  const [overflows, setOverflows] = useState(false)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = useCallback(() => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setOverflows(max > 2)
    setCanPrev(el.scrollLeft > 2)
    setCanNext(el.scrollLeft < max - 2)
  }, [])

  /**
   * One card along, in either direction. Measured from the first two cards so
   * the step includes the gap and follows whatever width the breakpoint gives
   * them; snapping then settles the row exactly on a card.
   */
  const step = (dir: -1 | 1) => {
    const el = ref.current
    const track = el?.firstElementChild
    if (!el || !track) return
    const [a, b] = Array.from(track.children) as HTMLElement[]
    const width = a && b ? b.offsetLeft - a.offsetLeft : (a?.offsetWidth ?? el.clientWidth)
    el.scrollBy({ left: dir * width, behavior: 'smooth' })
  }

  /**
   * On a phone a card is far narrower than the screen, so starting it at the
   * gutter leaves most of the next one showing and the row reads as parked
   * off to one side. Padding both ends by the leftover half centres every
   * card — including the first and last, which is what `snap-center` cannot
   * do — while the snapping stays `snap-start`.
   *
   * It is measured rather than declared because the padding depends on the
   * card's width, and that differs per section and per breakpoint.
   */
  const centreOnMobile = useCallback(() => {
    const el = ref.current
    const item = el?.firstElementChild?.firstElementChild as HTMLElement | undefined
    if (!el || !item) return

    if (!window.matchMedia(MOBILE_QUERY).matches) {
      el.style.paddingInlineStart = ''
      el.style.paddingInlineEnd = ''
      el.style.scrollPaddingInlineStart = ''
      return
    }

    const pad = Math.max(0, Math.round((el.clientWidth - item.offsetWidth) / 2))
    el.style.paddingInlineStart = `${pad}px`
    el.style.paddingInlineEnd = `${pad}px`
    // Must track the start padding, or a snapped card parks underneath it.
    el.style.scrollPaddingInlineStart = `${pad}px`
  }, [])

  useEffect(() => {
    centreOnMobile()
    const el = ref.current
    if (!el) return
    // The card's own width moves at breakpoints, so watching the element
    // catches what a resize listener alone would miss.
    const observer = new ResizeObserver(() => {
      centreOnMobile()
      updateArrows()
    })
    observer.observe(el)
    if (el.firstElementChild?.firstElementChild) {
      observer.observe(el.firstElementChild.firstElementChild)
    }
    el.addEventListener('scroll', updateArrows, { passive: true })
    updateArrows()
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', updateArrows)
    }
  }, [centreOnMobile, updateArrows, children])

  /**
   * Where a snapped card's start edge sits, in viewport coordinates.
   *
   * Read from padding, not scroll-padding. `.bleed-row` sets scroll-padding to
   * a calc() over a percentage, and a percentage against the element's own
   * width does not get resolved for the computed value — it comes back as the
   * literal string `calc(32px + (0.5 * (100% - min(100%, 1280px))))`, which
   * parseFloat turns into NaN. The two are defined to be equal, here and in
   * centreOnMobile, so the padding is the same number and always resolved.
   */
  const snapOrigin = (el: HTMLDivElement): number => {
    const styles = getComputedStyle(el)
    const scrollPad = parseFloat(styles.scrollPaddingInlineStart)
    const pad = Number.isFinite(scrollPad) ? scrollPad : parseFloat(styles.paddingInlineStart) || 0
    return el.getBoundingClientRect().left + pad
  }

  /**
   * Where the row would land if it snapped from here.
   *
   * Needed because turning `scroll-snap-type` back on does not re-snap what is
   * already on screen — the browser snaps as the result of a scroll, so a drag
   * that ends off a snap point simply stays there.
   */
  const nearestSnapLeft = (el: HTMLDivElement): number | null => {
    const track = el.firstElementChild
    if (!track) return null

    const origin = snapOrigin(el)

    let best: number | null = null
    for (const item of Array.from(track.children)) {
      const delta = item.getBoundingClientRect().left - origin
      if (best === null || Math.abs(delta) < Math.abs(best)) best = delta
    }
    if (best === null) return null

    const max = el.scrollWidth - el.clientWidth
    return Math.max(0, Math.min(max, el.scrollLeft + best))
  }

  // Mouse only. Touch and trackpads already scroll this natively, and taking
  // their pointer events over would replace momentum scrolling with this.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = ref.current
    if (!el || el.scrollWidth <= el.clientWidth) return

    drag.current = { startX: e.clientX, startLeft: el.scrollLeft, moved: false }

    // Snapping and smooth scrolling both fight a drag: the first keeps yanking
    // the row to the nearest card mid-gesture, the second animates towards
    // each position so the row lags the cursor. Off for the duration, and put
    // back by endDrag.
    el.style.scrollSnapType = 'none'
    el.style.scrollBehavior = 'auto'
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    const state = drag.current
    if (!el || !state) return

    const dx = e.clientX - state.startX
    if (!state.moved && Math.abs(dx) < DRAG_THRESHOLD) return

    if (!state.moved) {
      state.moved = true
      // Captured only once it is a real drag, so a plain click still lands on
      // the card underneath.
      el.setPointerCapture(e.pointerId)
    }

    el.scrollLeft = state.startLeft - dx
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    const state = drag.current
    if (!el || !state) return

    if (state.moved) {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)

      // The click that follows this pointerup would otherwise open whichever
      // card the drag finished over.
      const swallow = (click: MouseEvent) => {
        click.preventDefault()
        click.stopPropagation()
      }
      el.addEventListener('click', swallow, { capture: true, once: true })
      // If no click arrives — the pointer left the row, say — the listener has
      // to go, or it eats the next real one.
      window.setTimeout(() => el.removeEventListener('click', swallow, true), 0)

      const target = nearestSnapLeft(el)
      el.style.scrollSnapType = ''
      el.style.scrollBehavior = ''
      if (target !== null) el.scrollTo({ left: target, behavior: 'smooth' })
    } else {
      el.style.scrollSnapType = ''
      el.style.scrollBehavior = ''
    }

    drag.current = null
  }

  const arrow =
    'pointer-events-auto absolute top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow-lg transition-opacity hover:bg-white disabled:opacity-40 disabled:pointer-events-none'

  return (
    <div className="relative">
      {/* Same arrows as the logo carousel, so every horizontal row can be moved
        both ways: by scrolling/swiping/dragging and by clicking. They sit over
        the row's edges, inside the container gutter, and dim (not vanish) at
        the ends so the row always reads as scrollable. Absent when it fits. */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-10 container',
          !overflows && 'hidden',
        )}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canPrev}
          aria-label="Previous"
          className={cn(arrow, 'left-0')}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canNext}
          aria-label="Next"
          className={cn(arrow, 'right-0')}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // Images and links are draggable by default, so without this a real
        // mouse starts a native drag — the browser lifts a ghost of the card and
        // the row never moves. dragstart bubbles, so this one handler covers
        // every image and link inside.
        onDragStart={(e) => e.preventDefault()}
        className={cn(
          'bleed-row',
          'overflow-x-auto overflow-y-visible',
          'snap-x snap-mandatory scroll-smooth',
          // vertical breathing room for card hover lift and shadows
          'py-6 -my-6',
          // Only a mouse gets the grab cursor; it means nothing on a touchscreen.
          'cursor-default [@media(hover:hover)_and_(pointer:fine)]:cursor-grab',
          '[@media(hover:hover)_and_(pointer:fine)]:active:cursor-grabbing',
          className,
        )}
      >
        {/* select-none while dragging would need state; this is simpler and the
          cards carry no text worth selecting by dragging across. */}
        <div className={cn('flex w-max flex-row select-none', gapClassName)}>{children}</div>
      </div>
    </div>
  )
}

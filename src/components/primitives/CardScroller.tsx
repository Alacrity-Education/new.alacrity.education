'use client'

import React, { useRef } from 'react'

import { cn } from '@/utilities/ui'

/** Below this many pixels a drag is a click that wobbled, not a drag. */
const DRAG_THRESHOLD = 5

/**
 * Horizontal card scroller, shared by the card and person-card sections.
 *
 * It is not wrapped in a container: `.bleed-row` gives it the page's full
 * width while padding its start out to where container content begins, so the
 * row lines up with the heading above it at rest and runs to the screen edge
 * only once scrolled. Rendering it inside a container instead would clip the
 * cards at the gutter, which reads as a row cut off mid-card.
 *
 * Snapping is `snap-start` against a matching `scroll-padding`, not
 * `snap-center`: the first and last card have nothing to centre against and
 * settle partly out of view.
 */
export const CardScroller: React.FC<{
  children: React.ReactNode
  className?: string
  /** Gap between cards. Overridable for sections that space differently. */
  gapClassName?: string
}> = ({ children, className, gapClassName = 'gap-6 md:gap-8' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startX: number; startLeft: number; moved: boolean } | null>(null)

  // Mouse only. Touch and trackpads already scroll this natively, and taking
  // their pointer events over would replace momentum scrolling with this.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = ref.current
    if (!el || el.scrollWidth <= el.clientWidth) return

    drag.current = { startX: e.clientX, startLeft: el.scrollLeft, moved: false }

    // Snapping and smooth scrolling both fight a drag: the first keeps yanking
    // the row to the nearest card mid-gesture, the second animates towards
    // each position so the row lags the cursor. Off for the duration.
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
    }

    drag.current = null
    el.style.scrollSnapType = ''
    el.style.scrollBehavior = ''
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
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
  )
}

/** Wrapper every direct child of CardScroller needs, so snapping applies. */
export const cardScrollerItem = 'shrink-0 snap-start'

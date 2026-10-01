import React from 'react'

import { cn } from '@/utilities/ui'

/**
 * Horizontal card scroller, shared by the card and person-card sections.
 *
 * Two things it exists to get right:
 *
 * Full bleed. Inside a container the track stops at the gutter, so the row
 * looks clipped mid-card at both edges. This breaks out to the viewport and
 * re-applies the gutter as scroll padding, so cards run to the screen edge
 * while still lining up with the surrounding copy at rest.
 *
 * Snapping that never leaves a card half-shown. `snap-start` against matching
 * `scroll-px-*` lands each card on the gutter; `snap-center` cannot, because
 * the first and last card have nothing to centre against and settle partly
 * out of view.
 */
export const CardScroller: React.FC<{
  children: React.ReactNode
  className?: string
  /** Gap between cards. Overridable for sections that space differently. */
  gapClassName?: string
}> = ({ children, className, gapClassName = 'gap-6 md:gap-8' }) => (
  // left-1/2 + -translate-x-1/2 against w-screen is the full-bleed escape;
  // max-w-[100vw] keeps it from widening the page when a scrollbar is present.
  <div className={cn('relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2', className)}>
    <div
      className={cn(
        'overflow-x-auto overflow-y-visible',
        'snap-x snap-mandatory scroll-smooth',
        // gutter and scroll padding must match, or snapped cards sit under it
        'px-4 scroll-px-4 md:px-8 md:scroll-px-8',
        // vertical breathing room for card hover lift and shadows
        'py-6 -my-6',
      )}
    >
      <div className={cn('flex w-max flex-row', gapClassName)}>{children}</div>
    </div>
  </div>
)

/** Wrapper every direct child of CardScroller needs, so snapping applies. */
export const cardScrollerItem = 'shrink-0 snap-start'

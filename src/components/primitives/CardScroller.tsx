import React from 'react'

import { cn } from '@/utilities/ui'

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
}> = ({ children, className, gapClassName = 'gap-6 md:gap-8' }) => (
  <div
    className={cn(
      'bleed-row',
      'overflow-x-auto overflow-y-visible',
      'snap-x snap-mandatory scroll-smooth',
      // vertical breathing room for card hover lift and shadows
      'py-6 -my-6',
      className,
    )}
  >
    <div className={cn('flex w-max flex-row', gapClassName)}>{children}</div>
  </div>
)

/** Wrapper every direct child of CardScroller needs, so snapping applies. */
export const cardScrollerItem = 'shrink-0 snap-start'

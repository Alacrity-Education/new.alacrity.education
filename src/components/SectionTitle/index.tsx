'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/utilities/ui'

export interface SectionTitleProps {
  title?: string | null
  // false = no arrow | true = always visible | string = className applied to the arrow <span> (use for responsive hide/show)
  arrow?: boolean | string
  className?: string
  textClassName?: string
}

const BASE_TEXT =
  'text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary mt-0 mb-2 sm:mb-4 md:mb-6 lg:mb-8'

export const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ title, arrow = false, className, textClassName }, ref) => {
    if (!title) return null

    return (
      <div ref={ref} className={className}>
        <p className={cn('mb-0', BASE_TEXT, textClassName)}>
          {title}
          {arrow !== false && (
            <span className={typeof arrow === 'string' ? arrow : undefined}>{' '}→</span>
          )}
        </p>
      </div>
    )
  },
)
SectionTitle.displayName = 'SectionTitle'

'use client'

import React from 'react'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { customConverters } from '@/components/RichText/CustomConverter'

export const LowImpactHero: React.FC<Page['hero']> = ({ cta, richText }) => {
  return (
    <section className="bg-base-100 pt-10 sm:pt-0  border-b border-base-300">
      <div className="container mx-auto px-4 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8">

        <div className="flex items-stretch gap-4 min-w-0">
          {/* Primary accent bar */}
          <div className="w-1 shrink-0 rounded-full bg-primary self-stretch" aria-hidden />

          {richText && (
            <RichText
              className="min-w-0 [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-semibold
                         [&_h1]:leading-tight [&_h1]:mb-0 [&_p]:text-base-content/65
                         [&_p]:text-sm [&_p]:mt-1 [&_p]:mb-0"
              data={richText}
              converter={customConverters}
            />
          )}
        </div>

        {cta?.selectCTA === 'Button' && cta.links && cta.links.length > 0 && (
          <div className="flex flex-row flex-wrap gap-2 shrink-0">
            {cta.links.map(({ link }, i) => (
              <CMSLink key={i} size="sm" {...link} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

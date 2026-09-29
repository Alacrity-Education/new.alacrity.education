'use client'

import React from 'react'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { customConverters } from '@/components/RichText/CustomConverter'
import { hasRichTextContent } from '@/utilities/richText'
import { cn } from '@/utilities/ui'

export const MediumImpactHero: React.FC<Page['hero']> = ({ cta, media, mediaFit, richText }) => {
  const hasMedia = media && typeof media === 'object'
  // Null on heroes saved before the field existed, so cover stays the default.
  const isContain = mediaFit === 'contain'

  return (
    <section className="relative pt-10 sm:pt-0 bg-base-200/20 overflow-hidden md:-mt-10">
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div className="absolute -top-32 right-0 w-[480px] h-[480px] bg-primary/8 rounded-full blur-[96px]" />
        <div className="absolute bottom-0 -left-24 w-[360px] h-[360px] bg-secondary/6 rounded-full blur-[80px]" />
      </div>

      <div className="hero min-h-[48vh] sm:min-h-[52vh] pt-16 sm:pt-20 pb-14 sm:pb-18">
        <div className="hero-content flex-col w-full max-w-3xl px-4 text-center gap-0 relative z-10">

          {hasMedia && (
            <div className="w-full mb-8 sm:mb-10 group">
              <Media
                resource={media}
                pictureClassName="w-full"
                imgClassName={cn(
                  'w-full rounded-2xl aspect-video',
                  'group-hover:-translate-y-1 transition-transform duration-500',
                  // Contain letterboxes the image inside the frame, so a shadow
                  // and ring would outline the empty frame rather than the art.
                  isContain
                    ? 'object-contain'
                    : 'object-cover shadow-2xl ring-1 ring-base-content/8',
                )}
                priority
              />
            </div>
          )}

          {hasRichTextContent(richText) && (
            <RichText
              className="w-full [&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:md:text-5xl
                         [&_h1]:font-bold [&_h1]:mb-4
                         [&_p]:text-base-content/70"
              data={richText}
              converter={customConverters}
            />
          )}

          {cta?.selectCTA === 'Button' && cta.links && cta.links.length > 0 && (
            <div className="flex flex-row flex-wrap gap-3 mt-8 justify-center">
              {cta.links.map(({ link }, i) => (
                <CMSLink key={i} size="lg" {...link} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subtle bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-base-100 to-transparent pointer-events-none" />
    </section>
  )
}

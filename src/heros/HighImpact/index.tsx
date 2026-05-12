'use client'

import React from 'react'

import type { Page } from '@/payload-types'
import { Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { customConverters } from '@/components/RichText/CustomConverter'

type CTAsType = Page['hero']['cta']
type RichTextType = Page['hero']['richText']

export const HighImpactHero: React.FC<Page['hero']> = ({ cta, media, richText }) => {
  return (
    <Hero>
      <HeroImage media={media} />
      <HeroText cta={cta} richText={richText} />
    </Hero>
  )
}

export default function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className="hero z-0 relative bg-base-100 overflow-x-clip
                    min-h-[60vh] sm:min-h-[70vh] md:min-h-[70vh]
                    pt-8 pb-12 sm:pt-12 sm:pb-16 md:-mt-10 md:pb-0"
    >
      <div
        className="container mx-auto px-4
                      flex flex-col-reverse lg:flex-row-reverse
                      gap-8 sm:gap-10 lg:gap-0
                      items-center justify-between
                      h-full w-full"
      >
        {children}
      </div>
    </div>
  )
}

export const HeroText = ({
  richText,
  cta,
}: {
  richText?: RichTextType | null
  cta?: CTAsType | null
}) => {
  if (!richText) return null

  return (
    <div
      className="w-full lg:w-1/2 flex items-center justify-center
                    px-2 sm:px-4 lg:px-16 xl:px-32"
    >
      <div
        className="relative flex flex-col w-full
                      items-center text-center
                      lg:items-start lg:text-left"
      >
        <RichText
          className="max-w-md w-full sm:!mx-0 sm:!px-0 relative z-20"
          data={richText}
          converter={customConverters}
        />
        <HeroCTA {...cta} />
      </div>
    </div>
  )
}

export const HeroCTA = (props?: CTAsType) => {
  if (!props) return null
  const { selectCTA, links } = props

  if (selectCTA === 'None') return null

  if (selectCTA === 'Button')
    return (
      <>
        {links && (
          <div
            className="flex flex-row flex-wrap gap-2 mt-4 sm:mt-6
                          justify-center lg:justify-start
                          w-full z-30"
          >
            {links.map(({ link }, i) => (
              <CMSLink key={i} {...link} />
            ))}
          </div>
        )}
      </>
    )
}

export const HeroImage = ({ media }: { media?: MediaType | number | null }) => {
  if (!media && !(typeof media === 'object')) return null

  return (
    <div
      className="w-full lg:w-1/2 flex items-center justify-center
                    px-0 sm:px-8 lg:px-12 xl:px-20
                    pt-2 sm:pt-0"
    >
      <Media
        pictureClassName="w-full lg:h-full overflow-visible
                          hover:-translate-y-1 transition-transform
                          aspect-video z-10 rounded-lg"
        className="h-max w-full"
        imgClassName="z-20 object-cover w-full object-bottom
                      shadow-2xl rounded-lg aspect-video"
        priority
        resource={media}
      />
    </div>
  )
}

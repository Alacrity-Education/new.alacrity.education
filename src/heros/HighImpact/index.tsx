'use client'

import React from 'react'

import type { Page } from '@/payload-types'
import { Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { customConverters } from '@/components/RichText/CustomConverter'
import { cn } from '@/utilities/ui'

type CTAsType = Page['hero']['cta']
type RichTextType = Page['hero']['richText']

export const HighImpactHero: React.FC<Page['hero']> = ({ cta, media, richText, imageVariant }) => {
  const className = media ? "" : "justify-center";
  return (
    <Hero className={className}>
      {media && <HeroImage media={media} imageVariant={imageVariant} />}
      <HeroText cta={cta} richText={richText} />
    </Hero>
  )
}

export default function Hero({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <div
      className={"hero z-0 relative bg-base-100/30 overflow-x-clip min-h-[60vh] sm:min-h-[70lvh] md:min-h-[70lvh] pt-8 pb-12 sm:pt-12 sm:pb-16 md:-mt-10 md:pb-0"}
    >
      <div
        className={cn("container mx-auto px-4 flex flex-col-reverse lg:flex-row-reverse gap-8 sm:gap-10 lg:gap-0 items-center justify-between h-full w-full",className)}
      >
        {children}
      </div>
    </div>
  )
}

export const HeroText = ({
  richText,
  cta,
  className,
}: {
  richText?: RichTextType | null
  cta?: CTAsType | null
  className?: string
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
          className="max-w-md w-full sm:!mx-0 sm:!px-0 prose-p:text-base relative z-20!"
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
              <CMSLink key={i} size={"lg"} {...link} />
            ))}
          </div>
        )}
      </>
    )
}

export const HeroImage = ({
  media,
  imageVariant,
}: {
  media?: MediaType | number | null
  imageVariant?: Page['hero']['imageVariant']
}) => {
  if (!media && !(typeof media === 'object')) return null

  const isCircle = imageVariant === 'circle'

  return (
    <div
      className="w-full lg:w-1/2 flex items-center justify-center
                    px-0 sm:px-8 lg:px-12 xl:px-20
                    pt-2 sm:pt-0"
    >
      <Media
        pictureClassName={cn(
          'overflow-visible hover:-translate-y-1 transition-transform z-10',
          isCircle
            ? 'w-3/5 lg:w-full aspect-square rounded-full'
            : 'w-full lg:h-full lg:w-max aspect-video rounded-lg',
        )}
        className="h-max w-full lg:h-full lg:w-max"
        imgClassName={cn(
          'z-20 object-contain w-full shadow-2xl lg:h-full lg:w-max',
          isCircle
            ? 'aspect-cover rounded-full object-center'
            : 'aspect-video rounded-lg object-bottom',
        )}
        priority
        resource={media}
      />
    </div>
  )
}

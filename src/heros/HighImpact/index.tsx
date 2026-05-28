'use client'

import React from 'react'
import dynamic from 'next/dynamic'

import type { Page } from '@/payload-types'
import { Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { customConverters } from '@/components/RichText/CustomConverter'
import { cn } from '@/utilities/ui'

const Media3D = dynamic(
  () => import('@/components/Media3D').then((m) => ({ default: m.Media3D })),
  { ssr: false },
)

type CTAsType = Page['hero']['cta']
type RichTextType = Page['hero']['richText']

const is3DMedia = (media: MediaType): boolean =>
  ['model/gltf-binary', 'model/gltf+json'].includes(media.mimeType ?? '') ||
  /\.(glb|gltf)$/i.test(media.filename ?? '')

export const HighImpactHero: React.FC<Page['hero']> = ({ cta, media, richText, imageVariant }) => {
  const mediaObj = typeof media === 'object' && media !== null ? (media as MediaType) : null
  const is3D = mediaObj ? is3DMedia(mediaObj) : false

  if (is3D && mediaObj?.url) {
    const hasText = Boolean(richText)

    if (!hasText) {
      return (
        <Hero>
          <div className="absolute inset-0 z-0 w-full h-full">
            <Media3D url={mediaObj.url} defaultZoom={mediaObj.defaultZoom} />
          </div>
        </Hero>
      )
    }

    return (
      <Hero>
        {/* Right side on desktop (flex-row-reverse), bottom on mobile (flex-col-reverse).
            Mobile: aspect-video equivalent for a full-width element (56vw ≈ 16:9).
            Desktop: matches the hero's min-h so the canvas fills the whole right half. */}
        <div className="w-full lg:w-1/2 h-[56vw] sm:h-[45vw] lg:h-[70lvh]">
          <Media3D url={mediaObj.url} defaultZoom={mediaObj.defaultZoom} />
        </div>
        <HeroText cta={cta} richText={richText} />
      </Hero>
    )
  }

  const className = media ? '' : 'justify-center'
  return (
    <Hero className={className}>
      {media && <HeroImage media={media} imageVariant={imageVariant} />}
      <HeroText cta={cta} richText={richText} />
    </Hero>
  )
}

export default function Hero({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className="hero z-0 relative bg-base-100/30 overflow-x-clip min-h-[60vh] sm:min-h-[70lvh] md:min-h-[70lvh] pt-20 pb-12 sm:pt-12 sm:pb-16 md:-mt-10 md:pb-0">
      <div
        className={cn(
          'container mx-auto px-4 flex flex-col-reverse lg:flex-row-reverse gap-8 sm:gap-10 lg:gap-0 items-center justify-between h-full w-full',
          className,
        )}
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
      className={cn(
        'w-full lg:w-1/2 flex items-center justify-center px-2 sm:px-4 lg:px-16 xl:px-32',
        className,
      )}
    >
      <div className="relative flex flex-col w-full items-center text-center lg:items-start lg:text-left">
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
          <div className="flex flex-row flex-wrap gap-2 mt-4 sm:mt-6 justify-center lg:justify-start w-full z-30">
            {links.map(({ link }, i) => (
              <CMSLink key={i} size={'lg'} {...link} />
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
    <div className="w-full lg:w-1/2 flex items-center justify-center px-0 sm:px-8 lg:px-12 xl:px-20 pt-2 sm:pt-0">
      <Media
        pictureClassName={cn(
          'overflow-visible hover:-translate-y-1 transition-transform z-10',
          isCircle
            ? 'w-2/5 lg:w-full aspect-square rounded-full'
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

import React from 'react'
import Image from 'next/image'
import type { GalleryBlock, Media } from '@/payload-types'
import { SectionTitle } from '@/components/SectionTitle'
import { getMediaUrl } from '@/utilities/getMediaUrl'

interface GalleryContentProps {
  heading?: string | null
  headingHighlight?: string | null
  subtitle?: string | null
  images?: GalleryBlock['images']
}

// Repeating pattern of aspect ratios so neighbouring images are never the same shape
const ASPECTS = [
  'aspect-video',
  'aspect-[3/4]',
  'aspect-square',
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-video',
]

export default function GalleryContent({
  heading,
  headingHighlight,
  subtitle,
  images,
}: GalleryContentProps) {
  const allImages = images || []
  const titleText = [heading, headingHighlight].filter(Boolean).join(' ')

  const colClass =
    allImages.length <= 2
      ? 'columns-1 sm:columns-2'
      : allImages.length <= 4
        ? 'columns-1 sm:columns-2 lg:columns-3'
        : 'columns-1 sm:columns-2 lg:columns-3'

  return (
    <div className="w-full">
      <div className="container">
        <SectionTitle title={titleText} className="mb-2" />
        {subtitle && <p className="text-base-content/60 mb-6">{subtitle}</p>}

        <div className={`${colClass} gap-4`}>
          {allImages.map((item, i) => (
            <GalleryImageItem
              key={i}
              image={item.image}
              aspect={ASPECTS[i % ASPECTS.length]!}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function GalleryImageItem({
  image,
  aspect,
}: {
  image: Media | number | null | undefined
  aspect: string
}) {
  const url =
    typeof image === 'object' && image?.url
      ? getMediaUrl(image.url, image.updatedAt)
      : '/Falcon.svg'
  const alt = typeof image === 'object' && image?.alt ? image.alt : 'Gallery image'

  return (
    <div className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className={`${aspect} relative w-full`}>
        <Image
          alt={alt}
          src={url}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  )
}

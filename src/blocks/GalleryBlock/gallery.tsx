'use client'

import React, { useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'

import type { GalleryBlock, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { SectionTitle } from '@/components/SectionTitle'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { richTextToPlainText } from '@/utilities/richText'

interface GalleryContentProps {
  title?: string | null
  images?: GalleryBlock['images']
}

export default function GalleryContent({ title, images }: GalleryContentProps) {
  const [openAt, setOpenAt] = useState<number | null>(null)

  // Rows of equal tiles rather than masonry columns: CSS columns leave the
  // bottom ragged whenever the image count does not divide evenly, and the
  // shortfall is worst at exactly the counts a gallery usually has.
  //
  // Only resolved uploads survive — an unresolved relationship has no URL to
  // put in a tile or a slide.
  const resolved = useMemo(
    () =>
      (images ?? [])
        .map((item) => item.image)
        .filter((image): image is MediaType => typeof image === 'object' && image !== null),
    [images],
  )

  const slides = useMemo(
    () =>
      resolved.map((image) => ({
        src: getMediaUrl(image.url, image.updatedAt),
        alt: image.alt ?? '',
        title: image.alt ?? undefined,
        description: richTextToPlainText(image.caption) || undefined,
      })),
    [resolved],
  )

  if (resolved.length === 0) return null

  return (
    <div className="w-full">
      <div className="container">
        <SectionTitle title={title} className="mb-8" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resolved.map((image, i) => (
            <button
              key={image.id ?? i}
              type="button"
              onClick={() => setOpenAt(i)}
              aria-label={image.alt ? `Open ${image.alt}` : `Open image ${i + 1}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Media
                resource={image}
                fill
                className="h-full w-full"
                imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        open={openAt !== null}
        index={openAt ?? 0}
        close={() => setOpenAt(null)}
        slides={slides}
        plugins={[Captions, Counter]}
        // Arrows and keyboard navigation are core behaviour; captions are only
        // shown for slides that actually carry one.
        captions={{ showToggle: true, descriptionTextAlign: 'center' }}
        carousel={{ finite: true }}
      />
    </div>
  )
}

'use client'
import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

import type { SlideImage } from 'yet-another-react-lightbox'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type MediaSlide = SlideImage & { resource: MediaType }

interface ImageStackProps {
  images: Array<{ image: MediaType | number | null; id?: string | null }>
  className?: string
}

export const ImageStack: React.FC<ImageStackProps> = ({ images, className }) => {
  const [open, setOpen] = useState(false)

  // Only work with fully-populated image objects (not bare IDs)
  const populated = (images ?? []).filter(
    (item): item is { image: MediaType; id?: string | null } =>
      typeof item.image === 'object' && item.image !== null,
  )

  if (populated.length === 0) return null

  const frontImage = populated[0]!
  // 3+ images: back layer (-4deg) + mid layer (+4deg)
  // 2 images:  no back layer, mid layer (+4deg) only
  const backImage = populated.length >= 3 ? populated[1]! : null
  const midImage =
    populated.length >= 2
      ? populated.length >= 3
        ? populated[2]!
        : populated[1]!
      : null

  const hasStack = populated.length >= 2

  const slides: MediaSlide[] = populated.map((item) => ({
    src: item.image.url ?? '',
    resource: item.image,
    width: item.image.width ?? undefined,
    height: item.image.height ?? undefined,
    alt: item.image.alt ?? 'Gallery image',
  }))

  return (
    <>
      <div
        className={cn('relative aspect-square group', hasStack && 'cursor-pointer', className)}
        onClick={hasStack ? () => setOpen(true) : undefined}
        role={hasStack ? 'button' : undefined}
        aria-label={hasStack ? `View all ${populated.length} photos` : undefined}
        tabIndex={hasStack ? 0 : undefined}
        onKeyDown={
          hasStack
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setOpen(true)
                }
              }
            : undefined
        }
      >
        {/* Layer 0: back — 3+ images only; rests at rotate(0), fans to -4deg on hover */}
        {backImage && (
          <div className="absolute inset-0 z-0 rounded-xl overflow-hidden transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-[4deg] group-hover:-translate-y-1">
            <Media
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
              resource={backImage.image}
            />
          </div>
        )}

        {/* Layer 1: mid — 2+ images; rests at rotate(0), fans to +4deg on hover */}
        {midImage && (
          <div className="absolute inset-0 z-[1] rounded-xl overflow-hidden transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] [transition-delay:40ms] group-hover:rotate-[4deg] group-hover:-translate-y-1">
            <Media
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
              resource={midImage.image}
            />
          </div>
        )}

        {/* Layer 2: front — always on top, no animation */}
        <div className="absolute inset-0 z-[2] rounded-xl overflow-hidden shadow-lg">
          <Media
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
            resource={frontImage.image}
          />
        </div>

        {/* Photo count badge — fades out on hover */}
        {hasStack && (
          <div className="absolute bottom-2 right-2 z-20 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded transition-opacity duration-200 group-hover:opacity-0 pointer-events-none select-none">
            📷 {populated.length}
          </div>
        )}
      </div>

      {hasStack && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          plugins={[Thumbnails, Zoom]}
          render={{
            slide: ({ slide }) => {
              const s = slide as MediaSlide
              if (!s.resource) return undefined
              return (
                <div className="relative flex items-center justify-center w-full h-full">
                  <Media resource={s.resource} imgClassName="object-contain max-h-full" />
                </div>
              )
            },
          }}
        />
      )}
    </>
  )
}

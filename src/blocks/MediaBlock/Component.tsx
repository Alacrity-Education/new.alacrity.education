import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    scale,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  /**
   * Constrain the wrapper's width rather than using `transform: scale()`: a
   * transform doesn't reflow, so it would leave the original footprint behind
   * as whitespace and resample the already-rendered bitmap. Narrowing the box
   * lets next/image pick a smaller source too. Clamped here as well as in the
   * config, since existing rows predate the field's min/max.
   */
  const scalePercent =
    typeof scale === 'number' && scale > 0 && scale < 100 ? Math.max(1, scale) : null

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) &&
        (() => {
          const image = (
            <Media
              imgClassName={cn('rounded-box h-max', imgClassName)}
              pictureClassName="rounded-box h-max"
              className="rounded-box h-max"
              resource={media}
              src={staticImage}
            />
          )

          // No wrapper at full size, so the unscaled path renders exactly as before.
          if (scalePercent === null) return image

          return (
            <div className="mx-auto max-w-full" style={{ width: `${scalePercent}%` }}>
              {image}
            </div>
          )
        })()}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}

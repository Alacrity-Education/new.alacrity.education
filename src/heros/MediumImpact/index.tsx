import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { CMSLink } from '@/components/Link'

export const MediumImpactHero: React.FC<any> = ({ richText, links, media, layout }) => {
  // 1. Extract the new width and height variables
  const {
    padding,
    textPosition,
    imagePosition,
    backgroundColor,
    textColor,
    imageWidth, // ✨ NEW
    imageHeight, // ✨ NEW
  } = layout || {}

  const safeTextPosition = (textPosition as 'left' | 'center' | 'right') || 'left'

  const textAlignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[safeTextPosition]

  const flexDirClass =
    imagePosition === 'left' ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row'

  return (
    <section
      className="w-full relative"
      style={{
        backgroundColor: backgroundColor || '#ffffff',
        color: textColor || '#000000',
        paddingTop: padding?.top || '0px',
        paddingRight: padding?.right || '0px',
        paddingBottom: padding?.bottom || '0px',
        paddingLeft: padding?.left || '0px',
      }}
    >
      <div className={`container mx-auto flex items-center justify-between gap-8 ${flexDirClass}`}>
        {/* TEXT COLUMN */}
        <div className={`w-full md:w-1/2 ${textAlignmentClass}`}>
          {richText && <RichText data={richText} />}

          {Array.isArray(links) && links.length > 0 && (
            <div
              className={`mt-6 flex gap-4 flex-wrap ${
                safeTextPosition === 'center'
                  ? 'justify-center'
                  : safeTextPosition === 'right'
                    ? 'justify-end'
                    : 'justify-start'
              }`}
            >
              {links.map(({ link }, i) => {
                return <CMSLink key={i} size="lg" {...link} />
              })}
            </div>
          )}
        </div>

        {/* IMAGE COLUMN */}
        {media && typeof media === 'object' && (
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src={media.url || ''}
              alt={media.alt || 'Hero image'}
              // These remain for Next.js intrinsic optimization:
              width={media.width || 800}
              height={media.height || 600}
              className="object-cover rounded-lg"
              // ✨ APPLY CUSTOM DIMENSIONS HERE ✨
              style={{
                width: imageWidth || '100%',
                height: imageHeight || 'auto',
                maxWidth: '100%', // Ensures it doesn't break mobile screens
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}

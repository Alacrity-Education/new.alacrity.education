import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { hasRichTextContent } from '@/utilities/richText'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: 'lg:col-span-12',
    half: 'lg:col-span-6',
    oneThird: 'lg:col-span-4',
    twoThirds: 'lg:col-span-8',
  }

  return (
    <div className="container my-4 px-2 sm:px-0">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 xl:gap-x-8 max-w-full text-wrap! place-items-center">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { richText, size, centerContent } = col

            return (
              <div
                className={cn(`col-span-4`, {
                  'md:col-span-2': size !== 'full',
                }, colsSpanClasses[size!])}
                key={index}
              >
                {hasRichTextContent(richText) && (
                  <RichText
                    data={richText}
                    className={cn(
                      'text-wrap! w-full h-max',
                      // The grid's place-items-center already centres the box in
                      // its track, so this only has to handle the text itself.
                      centerContent && 'text-center',
                    )}
                    enableGutter={false}
                  />
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

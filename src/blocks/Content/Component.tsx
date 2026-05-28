import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: 'lg:col-span-12',
    half: 'lg:col-span-6',
    oneThird: 'lg:col-span-4',
    twoThirds: 'lg:col-span-8',
  }

  return (
    <div className="container my-4">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16 max-w-full text-wrap!">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { richText, size, xlText } = col

            return (
              <div
                className={cn(`col-span-4`, {
                  'md:col-span-2': size !== 'full',
                }, colsSpanClasses[size!])}
                key={index}
              >
                {richText && <RichText data={richText} className={cn("text-wrap! w-full", xlText && "!prose-xl")} enableGutter={false} />}


              </div>
            )
          })}
      </div>
    </div>
  )
}

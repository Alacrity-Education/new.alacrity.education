import React from 'react'
import { Media } from '@/components/Media'
import { Card, CardImage, CardBody } from '@/components/primitives/card'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { SectionTitle } from '@/components/SectionTitle'

import type { CardBlock as CardBlockProps } from '@/payload-types'

type CarouselCards = NonNullable<CardBlockProps['cards']>

export const CarouselVariant: React.FC<{
  title?: string | null
  cards?: CarouselCards | null
}> = ({ title, cards }) => {
  const count = (cards || []).length

  type OverflowBreak = 'never' | 'md' | 'lg' | 'always'
  const overflowBreak: OverflowBreak =
    count <= 1 ? 'never' :
    count === 2 ? 'md' :
    count === 3 ? 'lg' :
    'always'

  const titleWrapperClass: Record<OverflowBreak, string> = {
    never:  'flex justify-center mb-8',
    md:     'flex items-end justify-between mb-8 md:justify-center',
    lg:     'flex items-end justify-between mb-8 lg:justify-center',
    always: 'flex items-end justify-between mb-8',
  }

  const titleTextClass: Record<OverflowBreak, string> = {
    never:  'text-center',
    md:     'md:text-center',
    lg:     'lg:text-center',
    always: '',
  }

  const arrowClass: Record<OverflowBreak, string> = {
    never:  'hidden',
    md:     'shrink-0 md:hidden',
    lg:     'shrink-0 lg:hidden',
    always: 'shrink-0',
  }

  return (
    <div className="container ">
      <SectionTitle
        title={title}
        arrow={arrowClass[overflowBreak]}
        className={cn(titleWrapperClass[overflowBreak], 'lg:py-4')}
        textClassName={titleTextClass[overflowBreak]}
      />

      {/* py-6 -my-6 creates vertical room inside the scroll container so box-shadows aren't clipped */}
      <div className="overflow-x-auto snap-x snap-mandatory px-4 py-6 -my-6">
        <div className="flex flex-row gap-6 py-2">
          {(cards || []).map((card, i) => {
            const v = card?.variant
            const titleClass = cn(
              'text-lg lg:text-3xl font-bold leading-snug',
              v === 'base' ? 'text-primary' : 'text-primary-content',
            )
            const descClass = cn(
              'text-sm lg:text-lg mt-1',
              v === 'base' ? 'text-base-content/70' : 'text-primary-content/70',
            )

            return (
              <div key={card.id ?? i} className="shrink-0 snap-center">
                <Card variant={v ?? undefined}>
                  {card.image && (
                    <CardImage>
                      <Media
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover"
                        resource={card.image}
                      />
                    </CardImage>
                  )}

                  <CardBody>
                    <h3 className={titleClass}>{card.title}</h3>
                    {card.description && <p className={descClass}>{card.description}</p>}
                  </CardBody>

                  {card.link?.label && <CMSLink {...card.link} />}
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

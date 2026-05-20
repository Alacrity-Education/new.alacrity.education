import React from 'react'
import { Media } from '@/components/Media'
import { Card, CardImage, CardBody, CardCTA } from '@/components/primitives/card'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { SectionTitle } from '@/components/SectionTitle'

type CardVariant = 'base' | 'primary'

type BaseAppearance = 'default' | 'primary' | 'baseOverlap'
type PrimaryAppearance = 'default' | 'primary' | 'primaryOverlap'

interface CardItem {
  title: string
  description?: string | null
  image?: MediaType | number | null
  link?: {
    type?: 'reference' | 'custom' | null
    newTab?: boolean | null
    url?: string | null
    label?: string | null
    appearance?: BaseAppearance | null
    primaryAppearance?: PrimaryAppearance | null
  },
  variant?: CardVariant
  id?: string | null
}

interface CardBlockProps {
  title?: string | null
  cards?: CardItem[] | null
}

export const CardBlock: React.FC<CardBlockProps> = ({ title, cards }) => {
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
            const v= card?.variant
            console.log(v)
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
              <Card variant={v}>
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
                  {card.description && (
                    <p className={descClass}>{card.description}</p>
                  )}
                </CardBody>

                {card.link?.label && (
                  <CMSLink
                    {...card.link}

                  />
                )}
              </Card>
            </div>
          )})}
        </div>
      </div>
    </div>
  )
}

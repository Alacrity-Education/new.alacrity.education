import React from 'react'
import { Media } from '@/components/Media'
import { Card, CardImage, CardBody } from '@/components/primitives/card'
import { CardScroller, cardScrollerItem } from '@/components/primitives/CardScroller'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { SectionTitle } from '@/components/SectionTitle'

import type { CardBlock as CardBlockProps } from '@/payload-types'

type RegularCards = NonNullable<CardBlockProps['cards']>
type Layout = CardBlockProps['layout']

const CardItem: React.FC<{ card: RegularCards[number] }> = ({ card }) => {
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
    <Card variant={v ?? undefined}>
      {card.image && (
        <CardImage>
          <Media className="w-full h-full" imgClassName="w-full h-full object-cover" resource={card.image} />
        </CardImage>
      )}

      <CardBody>
        <h3 className={titleClass}>{card.title}</h3>
        {card.description && <p className={descClass}>{card.description}</p>}
      </CardBody>

      {card.link?.label && <CMSLink {...card.link} />}
    </Card>
  )
}

export const RegularVariant: React.FC<{
  title?: string | null
  cards?: RegularCards | null
  layout?: Layout
}> = ({ title, cards, layout }) => {
  const items = cards || []
  if (items.length === 0) return null

  // Null on rows saved before the field existed. Those were all carousels, so
  // they keep scrolling; only new blocks get the grid default.
  const isCarousel = layout !== 'grid'

  const count = items.length
  type OverflowBreak = 'never' | 'md' | 'lg' | 'always'
  const overflowBreak: OverflowBreak =
    count <= 1 ? 'never' : count === 2 ? 'md' : count === 3 ? 'lg' : 'always'

  const titleWrapperClass: Record<OverflowBreak, string> = {
    never: 'flex justify-center mb-8',
    md: 'flex items-end justify-between mb-8 md:justify-center',
    lg: 'flex items-end justify-between mb-8 lg:justify-center',
    always: 'flex items-end justify-between mb-8',
  }
  const titleTextClass: Record<OverflowBreak, string> = {
    never: 'text-center',
    md: 'md:text-center',
    lg: 'lg:text-center',
    always: '',
  }
  // The arrow hints that there is more to scroll, so it only belongs on the
  // carousel, and only while the cards actually overflow.
  const arrowClass: Record<OverflowBreak, string> = {
    never: 'hidden',
    md: 'shrink-0 md:hidden',
    lg: 'shrink-0 lg:hidden',
    always: 'shrink-0',
  }

  // The scroller sits outside the container on purpose: it spans the page and
  // pads itself back in to the container's content edge. See CardScroller.
  return (
    <>
      <div className="container">
        <SectionTitle
          title={title}
          arrow={isCarousel ? arrowClass[overflowBreak] : false}
          className={cn(isCarousel ? titleWrapperClass[overflowBreak] : 'mb-8', 'lg:py-4')}
          textClassName={isCarousel ? titleTextClass[overflowBreak] : undefined}
        />
      </div>

      {isCarousel ? (
        <CardScroller>
          {items.map((card, i) => (
            <div key={card.id ?? i} className={cn(cardScrollerItem, 'w-xs md:w-sm')}>
              <CardItem card={card} />
            </div>
          ))}
        </CardScroller>
      ) : (
        <div className="container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {items.map((card, i) => (
            <CardItem key={card.id ?? i} card={card} />
          ))}
        </div>
      )}
    </>
  )
}

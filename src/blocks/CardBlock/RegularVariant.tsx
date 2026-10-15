import React from 'react'
import { Media } from '@/components/Media'
import { CardScroller, cardScrollerItem } from '@/components/primitives/CardScroller'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { SectionTitle } from '@/components/SectionTitle'

import type { CardBlock as CardBlockProps } from '@/payload-types'

type RegularCards = NonNullable<CardBlockProps['cards']>
type Layout = CardBlockProps['layout']

/**
 * Same tint the big card block puts over its full-bleed image. It is what makes
 * the copy legible over an arbitrary upload, so the card carries it whether or
 * not there is an image — without one it is just the primary ground.
 */
const CARD_TINT = 'bg-linear-to-b from-primary/95 via-primary/88 to-primary/80'

/**
 * The big card block's full-cover treatment at regular-card scale: image across
 * the whole card, primary tint over it, copy on top. Cards no longer pick a
 * colour — one treatment, so a row of them reads as a set.
 */
const CardItem: React.FC<{ card: RegularCards[number] }> = ({ card }) => (
  <article className="relative flex aspect-4/5 w-full flex-col overflow-hidden rounded-box bg-primary shadow-lg">
    {card.image && (
      <Media
        className="absolute inset-0 h-full w-full"
        imgClassName="h-full w-full object-cover"
        resource={card.image}
      />
    )}

    {/* z-10 over the image, under the copy at z-20 */}
    <div className={cn('pointer-events-none absolute inset-0 z-10', CARD_TINT)} />

    {/* Scaled down from the big card's p-8/10/12 — same inset, smaller card. */}
    <div className="relative z-20 flex min-h-0 flex-1 flex-col p-6 lg:p-8">
      <h3 className="text-lg font-bold leading-snug text-primary-content lg:text-3xl">
        {card.title}
      </h3>
      {card.description && (
        <p className="mt-1 text-sm text-primary-content/70 lg:text-lg">{card.description}</p>
      )}

      {card.link?.label && (
        <CMSLink
          {...card.link}
          appearance="default"
          size="sm"
          // mt-auto, not the big card's mt-8: the aspect is fixed here, so
          // anything else leaves the button stranded above dead space.
          // text-sm! overrides the appearance's own text-lg, which btn-sm
          // otherwise fights.
          className="mt-auto w-max text-sm!"
        />
      )}
    </div>
  </article>
)

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

import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { SectionTitle } from '@/components/SectionTitle'
import { CardScroller } from '@/components/primitives/CardScroller'
import { cardScrollerItem } from '@/components/primitives/cardScrollerItem'
import { cn } from '@/utilities/ui'

import type { CardBlock as CardBlockProps } from '@/payload-types'
import { hasRichTextContent } from '@/utilities/richText'

// The same rows the regular variant renders. One array, two ways of drawing
// it — which is what lets a section switch variant without going blank.
type BigCards = NonNullable<CardBlockProps['cards']>
type BigCard = BigCards[number]

/**
 * Two stops, 90 down to 72, rather than the regular card's three.
 *
 * The heading sits at the top of this card and the picture has the whole
 * height to show through, so the tint is heaviest exactly where the type is
 * and lightest where there is nothing over it. Dropping the middle stop is
 * what makes it a run rather than three near-identical steps.
 *
 * The regular card keeps its own 85/79/72: it is a smaller card whose copy
 * reaches further down, so it cannot afford to thin out at the bottom.
 */
const imageTint = 'bg-linear-to-b from-primary/90 to-primary/72'

/**
 * Also fixed across widths: with the card's own aspect pinned, a split that
 * moved at sm would still make the same card read differently on a phone.
 */
const PARTIAL_IMAGE_BASIS = 'basis-3/5'

/**
 * The same 4:5 the regular cards use. These were taller and wider than a
 * regular card — 0.7 stepping to 0.9 from md, two across — and are now the
 * same card at the same size; what still separates the variants is the content
 * they take, not their footprint.
 */
const CARD_ASPECT = 'aspect-4/5'

/**
 * 4:5 as the minimum, not a fixed size: a card grows when its copy needs more
 * room (a narrow phone, or larger system text) instead of clipping it and
 * dropping the button onto the text. Cards in a row still match — the row
 * stretches the others to the tallest.
 *
 * That growth comes from `overflow-clip`. An aspect-ratio box may grow to fit
 * its content only if it is not a scroll container; `overflow: hidden` makes
 * it one (so the 4:5 height was final), `clip` clips the rounded corners just
 * the same without doing so.
 */
const CARD_SHELL = cn(
  'relative flex flex-col w-full overflow-clip rounded-box bg-primary',
  CARD_ASPECT,
)

/** The copy layer for FullCard: stretches to own the whole card. */
const FullCardCopy: React.FC<{ card: BigCard }> = ({ card }) => (
  // z-20 keeps the copy above the tint (z-10) and the image (absolute, z-auto).
  // `grow`, not `flex-1`: a zero flex-basis made this layer count as 0px when
  // the card sized itself to its content, so CARD_SHELL's min-h-fit never grew.
  <div className="relative z-20 flex min-h-0 grow flex-col p-6 lg:p-8">
    {/* Sizes come from .prose-alacrity, same as every other rich text field
        in the app. `prose-on-primary` repoints only the colour palette. The
        two fields render as one block of copy — the heading the editor put in
        the title, then the body — which is what the single rich text field
        used to hold. */}
    {hasRichTextContent(card.title) && (
      <RichText
        data={card.title}
        enableGutter={false}
        className="prose-on-primary prose-md prose-big-card mx-0"
      />
    )}
    {hasRichTextContent(card.description) && (
      <RichText
        data={card.description}
        enableGutter={false}
        className="prose-on-primary prose-md prose-big-card mx-0 mt-1"
      />
    )}

    {card.link && (
      <>
        {/* Pushes the button to the card's bottom edge (what mt-auto did) but
            never closer than 1.5rem to the copy: when the copy fills a card
            that has grown to fit it, mt-auto left no gap at all. */}
        <div aria-hidden className="min-h-6 grow" />
        <CMSLink
          {...card.link}
          appearance="default"
          // No size: that is the button's regular size.
          className="w-max"
        />
      </>
    )}
  </div>
)

const CardTint: React.FC = () => (
  <div className={cn('pointer-events-none absolute inset-0 z-10', imageTint)} />
)

/**
 * Image bled across the whole card, with the copy floating over it.
 */
const FullCard: React.FC<{ card: BigCard }> = ({ card }) => (
  <article className={CARD_SHELL}>
    {card.image && (
      <Media
        className="absolute inset-0 h-full w-full"
        imgClassName="h-full w-full object-cover"
        resource={card.image}
        size="(max-width: 1024px) 90vw, 50vw"
      />
    )}
    <CardTint />
    <FullCardCopy card={card} />
  </article>
)

const PartialCard: React.FC<{ card: BigCard }> = ({ card }) => (
  <article className={CARD_SHELL}>
    <div className={cn('relative z-20 flex shrink-0 flex-col', 'px-6 pt-6 lg:px-8 lg:pt-8')}>
      {hasRichTextContent(card.title) && (
        <RichText
          data={card.title}
          enableGutter={false}
          className="prose-on-primary prose-md prose-big-card mx-0"
        />
      )}
      {hasRichTextContent(card.description) && (
        <RichText
          data={card.description}
          enableGutter={false}
          className="prose-on-primary prose-md prose-big-card mx-0 mt-1"
        />
      )}
      {card.link && (
        <CMSLink
          {...card.link}
          appearance="default"
          size={'sm'}
          // No size class: inherits, so it tracks the surrounding text.
          className={cn('w-max text-sm!')}
        />
      )}
    </div>

    {card.image && (
      <div className={cn('relative mt-auto w-full overflow-hidden', PARTIAL_IMAGE_BASIS)}>
        <Media
          className="h-full w-full"
          imgClassName="h-full w-full object-cover"
          resource={card.image}
          size="(max-width: 1024px) 90vw, 50vw"
        />
      </div>
    )}
  </article>
)

/**
 * `backgroundType` decides the card's whole layout, not just what sits behind
 * it, so the branch is at card level. It is null on cards saved before the
 * field existed — the default arm covers those.
 */
const BigCardItem: React.FC<{ card: BigCard }> = ({ card }) => {
  switch (card.backgroundType) {
    case 'partial':
      return <PartialCard card={card} />
    case 'full':
    default:
      return <FullCard card={card} />
  }
}

export const BigVariant: React.FC<{
  title?: string | null
  cards?: BigCards | null
  layout?: CardBlockProps['layout']
}> = ({ title, cards, layout }) => {
  if (!cards?.length) return null

  const isCarousel = layout === 'carousel'

  // The scroller sits outside the container on purpose: it spans the page and
  // pads itself back in to the container's content edge. See CardScroller.
  return (
    <>
      <div className="container">
        {/* Default SectionTitle sizing on purpose — this variant does not restyle it. */}
        <SectionTitle title={title} className="py-4" />
      </div>

      {isCarousel ? (
        <CardScroller>
          {cards.map((card, i) => (
            // The regular carousel's own widths, before that variant was taken
            // down a step. These carry a whole copy block, so they keep the
            // larger of the two.
            <div key={card.id ?? i} className={cn(cardScrollerItem, 'w-xs md:w-sm')}>
              <BigCardItem card={card} />
            </div>
          ))}
        </CardScroller>
      ) : (
        <div className="container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {cards.map((card, i) => (
            <BigCardItem key={card.id ?? i} card={card} />
          ))}
        </div>
      )}
    </>
  )
}

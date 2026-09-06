import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { SectionTitle } from '@/components/SectionTitle'
import { cn } from '@/utilities/ui'

import type { CardBlock as CardBlockProps } from '@/payload-types'

type BigCards = NonNullable<CardBlockProps['bigCards']>
type BigCard = BigCards[number]


const imageTint = 'bg-linear-to-b from-primary/95 via-primary/88 to-primary/80'

const PARTIAL_IMAGE_BASIS = 'basis-1/2 sm:basis-3/5'



/** Fixed proportions, so the two cards in a row always match. */
const CARD_SHELL =
  'relative flex flex-col w-full overflow-hidden rounded-box bg-primary aspect-[0.60] sm:aspect-[0.90]'

/** The copy layer for FullCard: stretches to own the whole card. */
const FullCardCopy: React.FC<{ card: BigCard }> = ({ card }) => (
  // z-20 keeps the copy above the tint (z-10) and the image (absolute, z-auto).
  <div className="relative z-20 flex min-h-0 flex-1 flex-col p-8 sm:p-10 lg:p-12">
    {card.richText && (
      // Sizes come from .prose-alacrity, same as every other rich text field in
      // the app. `prose-on-primary` repoints only the colour palette.
      <RichText
        data={card.richText}
        enableGutter={false}
        className="prose-on-primary prose-md mx-0"
      />
    )}


    {card.link && (
      <CMSLink
        {...card.link}
        appearance="inline"
        // No size class: inherits, so it tracks the surrounding text.
        className={cn(
          'mt-8 inline-flex w-max items-center gap-2 font-medium text-primary-content',
          'underline decoration-primary-content/50 underline-offset-4',
          'transition-colors hover:decoration-primary-content',
        )}
      />
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
      />
    )}
    <CardTint />
    <FullCardCopy card={card} />
  </article>
)


const PartialCard: React.FC<{ card: BigCard }> = ({ card }) => (
  <article className={CARD_SHELL}>
    <div className={cn('relative z-20 flex shrink-0 flex-col', "px-6 sm:px-10 lg:px-12 pt-8 sm:pt-10 lg:pt-12")}>
      {card.richText && (
        <RichText
          data={card.richText}
          enableGutter={false}
          className="prose-on-primary prose-md mx-0"
        />
      )}
      {card.link && (
        <CMSLink
          {...card.link}
          appearance="default"
          size={"sm"}
          // No size class: inherits, so it tracks the surrounding text.
          className={cn(
            'w-max text-sm!',
          )}
        />
      )}
    </div>



    {card.image && (
      <div className={cn('relative mt-auto w-full overflow-hidden', PARTIAL_IMAGE_BASIS)}>
        <Media
          className="h-full w-full"
          imgClassName="h-full w-full object-cover"
          resource={card.image}
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
}> = ({ title, cards }) => {
  if (!cards?.length) return null

  return (
    <div className="container">
      {/* Default SectionTitle sizing on purpose — this variant does not restyle it. */}
      <SectionTitle title={title} className="py-4" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {cards.map((card, i) => (
          <BigCardItem key={card.id ?? i} card={card} />
        ))}
      </div>
    </div>
  )
}

import React from 'react'

import type { CardBlock as CardBlockProps } from '@/payload-types'

import { BigVariant } from './BigVariant'
import { CarouselVariant } from './CarouselVariant'
import { FeaturedVariant } from './FeaturedVariant'

/**
 * Each variant reads its own array, so they are separate components rather than
 * one branching renderer — FeaturedVariant is a client component (gsap
 * ScrollTrigger) and the others need not be.
 *
 * `variant` is null on rows predating the field; those are all carousels.
 */
export const CardBlock: React.FC<CardBlockProps> = ({
  variant,
  title,
  cards,
  featuredCards,
  bigCards,
}) => {
  switch (variant) {
    case 'featured':
      return <FeaturedVariant title={title} cards={featuredCards} />
    case 'big':
      return <BigVariant title={title} cards={bigCards} />
    case 'carousel':
    default:
      return <CarouselVariant title={title} cards={cards} />
  }
}

import React from 'react'

import type { CardBlock as CardBlockProps } from '@/payload-types'

import { BigVariant } from './BigVariant'
import { RegularVariant } from './RegularVariant'
import { FeaturedVariant } from './FeaturedVariant'

/**
 * Separate components rather than one branching renderer: FeaturedVariant is a
 * client component (gsap ScrollTrigger) and the others need not be.
 *
 * Regular and big read the same `cards` array and differ only in how they draw
 * it, which is what lets a section switch between them without the editor
 * going blank. Featured keeps its own array — its cards carry a gallery and
 * several links, so there is nothing to share.
 *
 * `variant` is null on rows predating the field; those are all regular cards.
 */
export const CardBlock: React.FC<CardBlockProps> = ({
  variant,
  layout,
  title,
  cards,
  featuredCards,
}) => {
  switch (variant) {
    case 'featured':
      return <FeaturedVariant title={title} cards={featuredCards} />
    case 'big':
      return <BigVariant title={title} cards={cards} layout={layout} />
    case 'regular':
    default:
      return <RegularVariant title={title} cards={cards} layout={layout} />
  }
}

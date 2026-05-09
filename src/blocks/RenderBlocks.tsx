import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { CarouselLogoBlock } from '@/blocks/CarouselLogoBlock/Component'
import { GalleryBlock } from '@/blocks/GalleryBlock/Component'
import { CardBlock } from './CardBlock/Component'
import { Timeline } from '@/blocks/Timeline/Component'
import { FeaturedCardsBlock } from '@/blocks/FeaturedCardsBlock/Component'
import { GridBlock } from '@/blocks/GridBlock/Component'
import { PersonCardBlock } from '@/blocks/PersonCardBlock/Component'
import ContactMap from '@/blocks/Form/Map'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  carouselLogoBlock: CarouselLogoBlock,
  galleryBlock: GalleryBlock,
  cardBlock: CardBlock,
  timeline: Timeline,
  fcardsBlock: FeaturedCardsBlock,
  gridBlock: GridBlock,
  personCardBlock: PersonCardBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // Special handling for FormBlock to include map component
              if (blockType === 'formBlock') {
                return (
                  <div className="my-16" key={index}>
                    {/* @ts-expect-error there may be some mismatch between the expected types here */}
                    <FormBlock {...block} disableInnerContainer mapComponent={ContactMap} />
                  </div>
                )
              }

              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}

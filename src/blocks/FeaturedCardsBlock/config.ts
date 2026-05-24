import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

const cardRichTextEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const FeaturedCardsBlock: Block = {
  slug: 'fcardsBlock',
  interfaceName: 'FeaturedCardsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      fields: [
        {
          name: 'richText',
          type: 'richText',
          label: false,
          editor: cardRichTextEditor,
        },
        {
          name: 'gallery',
          type: 'array',
          label: 'Gallery Images',
          maxRows: 7,
          admin: {
            description:
              'First image is shown on the card. Up to 7 total — hovering the card fans out a photo stack; clicking opens the full gallery.',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        linkGroup({
          appearances: ['primary', 'baseOverlap', 'default', 'primaryOverlap'],
          overrides: { maxRows: 3 },
        }),
      ],
    },
  ],
  labels: {
    plural: 'Featured Card Sections',
    singular: 'Featured Card Section',
  },
}

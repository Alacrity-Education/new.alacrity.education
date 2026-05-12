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
      name: 'sectionTitle',
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
          name: 'media',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
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

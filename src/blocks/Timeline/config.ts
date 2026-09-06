import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

/**
 * Same editor the card variants use: h2 is the largest heading on offer, since
 * anything above it competes with the section title.
 */
const entryEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'Timeline',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'timelineElements',
      type: 'array',
      labels: {
        plural: 'Timeline Elements',
        singular: 'Timeline Element',
      },
      admin: {
        initCollapsed: true,
        description:
          'Entries run top to bottom. The number in each badge is the position in this list, so reordering renumbers them automatically.',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Date',
          admin: {
            date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' },
            description: 'Optional. Shown as the small uppercase eyebrow above the heading.',
          },
        },
        {
          // The heading lives in here, as it does on the card variants — there
          // is no separate title field.
          name: 'description',
          type: 'richText',
          label: false,
          editor: entryEditor,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          admin: {
            description: 'Shown from md up only. Hidden on phones, where the entry is text alone.',
          },
        },
        {
          name: 'highlight',
          type: 'checkbox',
          label: 'Highlight this entry',
          defaultValue: false,
          admin: {
            description: 'Sets the entry on a filled primary panel with white text.',
          },
        },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: 'Add a button',
        },
        link({
          appearances: ['default', 'primary'],
          overrides: {
            admin: {
              condition: (_, { enableLink }) => {
                return enableLink === true
              },
            },
          },
        }),
      ],
    },
  ],
  labels: {
    plural: 'Timeline',
    singular: 'Timeline',
  },
}

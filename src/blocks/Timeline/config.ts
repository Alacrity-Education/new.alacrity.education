import type { Block } from 'payload'
import { link } from '@/fields/link'

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'Timeline',

  fields: [
    {
      name: 'blockTitle',
      type: 'text',
      label: 'Block Title',
      admin: {
        description: 'Text that appears before the content of the block as a title.',
      },
    },
    {
      name: 'timelineElements',
      type: 'array',
      labels: {
        plural: 'Timeline Elements',
        singular: 'Timeline Element',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Date',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
        },
        {
          name: 'enableLink',
          type: 'checkbox',
        },
        link({
          appearances: ['default', 'primary'],
          overrides: {
            admin: {
              condition: (_, {enableLink} ) => {
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
    singular: 'Timelines',
  },
}

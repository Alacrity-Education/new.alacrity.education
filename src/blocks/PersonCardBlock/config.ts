import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'

export const PersonCardBlock: Block = {
  slug: 'personCardBlock',
  interfaceName: 'PersonCardBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'members',
      type: 'array',
      label: 'Members',
      fields: [
        {
          name: 'member',
          type: 'relationship',
          relationTo: 'members',
          required: true,
        },
      ],
    },
    linkGroup({
      appearances: ['primary', 'baseOverlap', 'default', 'primaryOverlap'],
      overrides: { maxRows: 2 },
    }),
  ],
  labels: {
    plural: 'Person Card Sections',
    singular: 'Person Card Section',
  },
}

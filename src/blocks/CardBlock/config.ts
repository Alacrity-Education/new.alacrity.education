import type { Block } from 'payload'

import { link } from '@/fields/link'

export const CardBlock: Block = {
  slug: 'cardBlock',
  interfaceName: 'CardBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      fields: [
        {
          name: 'variant',
          type: 'select',
          label: 'Variant',
          defaultValue: 'base',
          options: [
            { label: 'Base', value: 'base' },
            { label: 'Primary', value: 'primary' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },

        link({
          appearances: ['default', 'primary', 'baseOverlap', 'primaryOverlap'],
        }),
      ],
    },
  ],
}

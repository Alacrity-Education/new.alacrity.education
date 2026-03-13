import type { Block } from 'payload'

export const CardBlock: Block = {
  slug: 'cardBlock',
  interfaceName: 'CardBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Collection Type',
      options: [
        { label: 'Projects', value: 'projects' },
        { label: 'Perks', value: 'perks' },
      ],
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
  ],
}

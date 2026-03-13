import type { Block } from 'payload'

export const ShowcaseBlock: Block = {
  slug: 'showcaseBlock',
  interfaceName: 'ShowcaseBlock',
  fields: [
    {
      name: 'blockName',
      type: 'text',
      label: 'Block Name',
      admin: {
        description: 'The block which displays showcase perks',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Perks. Only some of them.',
    },
  ],
  labels: {
    plural: 'Showcase Blocks',
    singular: 'Showcase Block',
  },
}

import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'teamBlock',
  interfaceName: 'Team',
  fields: [
    {
      name: 'blockTitle',
      type: 'text',
      label: 'Block Title',
      admin: {
        description: 'Text that appears before the content of the block as a title.',
      },
    },
  ],
  labels: {
    plural: 'Team Blocks',
    singular: 'Team Block',
  },
}

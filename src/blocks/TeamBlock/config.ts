import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'teamBlock',
  interfaceName: 'TeamBlock',
  fields: [
    {
      name: 'blockName',
      type: 'text',
      label: 'Block Name',
      admin: {
        description: 'The block which displays all Alacrity team members',
      },
    },
  ],
  labels: {
    plural: 'Team Blocks',
    singular: 'Team Block',
  },
}

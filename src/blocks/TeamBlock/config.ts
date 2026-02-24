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
    {
      name: 'memberText',
      type: 'text',
      label: 'Team Section Text',
    },
  ],
  labels: {
    plural: 'Team Blocks',
    singular: 'Team Block',
  },
}

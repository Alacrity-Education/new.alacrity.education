import type { Block } from 'payload'

export const ProjectBlock: Block = {
  slug: 'projectBlock',
  interfaceName: 'ProjectBlock',
  fields: [
    {
      name: 'blockName',
      type: 'text',
      label: 'Block Name',
      admin: {
        description: 'The block which displays Alacrity projects',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Alacrity Projects.',
    },
  ],
  labels: {
    plural: 'Project Blocks',
    singular: 'Project Block',
  },
}

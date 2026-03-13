import type { Block } from 'payload'

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
      name: "timelineElements",
      type:"array",
      labels:{
        plural: "Timeline Elements",
        singular: "Timeline Element"
      },
      fields: [
        {
          name:"date",
          type:'date',
          label: "Date"
        },
        {
          name: "description",
          type:'richText',
          label: "Description"
        }
      ]
    }
  ],
  labels: {
    plural: 'Timeline',
    singular: 'Timelines',
  },
}

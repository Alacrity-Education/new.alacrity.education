import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'scale',
      type: 'number',
      label: 'Scale (%)',
      defaultValue: 100,
      min: 1,
      max: 100,
      admin: {
        step: 5,
        description:
          'Shrinks the image as a percentage of its container. 100 fills the width; the scaled image stays centred.',
      },
    },
  ],
}

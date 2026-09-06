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
      name: 'disableCaption',
      type: 'checkbox',
      label: 'Hide caption',
      defaultValue: false,
      admin: {
        description:
          'Captions come from the media item itself, so they appear everywhere it is used. Tick this to suppress it for this block only.',
      },
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

import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'galleryBlock',
  interfaceName: 'GalleryBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Main Heading',
      defaultValue: 'Our Impact.',
    },
    {
      name: 'headingHighlight',
      type: 'text',
      label: 'Heading Highlight (in primary color)',
      defaultValue: 'In Pictures.',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Some pictures from our projects.',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'Gallery Blocks',
    singular: 'Gallery Block',
  },
}

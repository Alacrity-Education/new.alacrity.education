import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'galleryBlock',
  interfaceName: 'GalleryBlock',
  fields: [
    {
      name: 'blockName',
      type: 'text',
      label: 'Block Name',
      admin: {
        description: 'The block which displays gallery images',
      },
    },
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
  ],
  labels: {
    plural: 'Gallery Blocks',
    singular: 'Gallery Block',
  },
}

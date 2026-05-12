import type { Block } from 'payload'

export const CarouselLogoBlock: Block = {
  slug: 'carouselLogoBlock',
  interfaceName: 'Logo Carousel',
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
      name: 'items',
      type: 'array',
      label: 'Logos to be displayed',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Logo title',
          required: true,
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: "link",
          type: 'text',
        }
      ],
    },
  ],
}

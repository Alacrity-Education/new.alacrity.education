import type { Block } from 'payload'

export const CarouselLogoBlock: Block = {
  slug: 'carouselLogoBlock',
  interfaceName: 'CarouselLogoBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Collection Type',
      options: [
        { label: 'Partners', value: 'partners' },
        { label: 'Sponsors', value: 'sponsors' },
      ],
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
  ],
}

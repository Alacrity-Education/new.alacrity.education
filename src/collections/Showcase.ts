import type { CollectionConfig } from 'payload'

export const Showcase: CollectionConfig = {
  slug: 'showcase',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'linkText',
      type: 'text',
    },
    {
      name: 'linkUrl',
      type: 'text',
    },
  ],
}

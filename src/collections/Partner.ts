import { CollectionConfig } from 'payload'

export const Partner: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'websiteUrl',
      type: 'text',
      required: true,
    },
  ],
}

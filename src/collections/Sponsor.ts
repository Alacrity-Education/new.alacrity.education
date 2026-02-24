import type { CollectionConfig } from 'payload'

export const Sponsor: CollectionConfig = {
  slug: 'sponsors',
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

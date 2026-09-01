import type { CollectionConfig } from 'payload'

export const Member: CollectionConfig = {
  slug: 'members',
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
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    // {
    //   name: 'bgless_image',
    //   type: 'upload',
    //   relationTo: 'media',
    //   required:false
    // },
    {
      name: 'linkedinUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
    },
  ],
}

import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Member: CollectionConfig = {
  slug: 'members',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
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
      name: 'title',
      type: 'text',
      required: false,
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

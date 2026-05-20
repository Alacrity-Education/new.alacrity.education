import type { GlobalConfig } from 'payload'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navColumns',
      type: 'array',
      maxRows: 4,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          maxRows: 8,
          admin: { initCollapsed: true },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: false,
              label: 'Open in new tab',
            },
            {
              name: 'download',
              type: 'checkbox',
              defaultValue: false,
              label: 'Download file',
            },
          ],
        },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Changing the education of the future.',
    },
    {
      name: 'socialLinks',
      type: 'array',
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Twitter / X', value: 'twitter' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}

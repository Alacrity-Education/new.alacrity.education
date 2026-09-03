import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
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
      // The footer grid is 4 columns wide at xl, so 8 is the most that still
      // fits in the two rows the layout allows for. See src/Footer/Component.tsx.
      maxRows: 8,
      admin: {
        initCollapsed: true,
        description:
          'Laid out 2 across until lg, then 3 at lg and 4 at xl, filling from the right — so up to 8 columns wrap into at most two rows.',
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
            // The shared link field, as the blocks use it — internal reference
            // or custom URL, with the label and newTab handled for us.
            // Appearances are off: footer links are always plain text links.
            link({ appearances: false }),
            {
              name: 'download',
              type: 'checkbox',
              defaultValue: false,
              label: 'Download file',
              admin: {
                description:
                  'Adds a download attribute. Only has an effect on same-origin URLs, e.g. an uploaded PDF.',
              },
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

import type { GlobalConfig } from 'payload'

import { appearanceOptions, link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      label: 'Enable Highlight Button',
      name: 'enableHighlightButton',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      label: 'Enable Highlight Banner',
      name: 'enableHighlightBanner',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      label: 'Highlight Banner',
      name: 'highlightBanner',
      type: 'group',
      fields: [
        {
          label: 'Banner Text',
          type: 'richText',
          name: 'bannerText',
        },
      ],
      admin: {
        condition: (_, sibling) => sibling?.enableHighlightBanner === true,
      },
    },
    {
      label: 'Highlight Button',
      name: 'highlightButton',
      type: 'group',
      fields: [
        link({
          appearances: ['secondary', 'default', 'primaryOverlap'],
        }),
      ],
      admin: {
        condition: (_, sibling) => sibling?.enableHighlightButton === true,
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'itemType',
          type: 'select',
          defaultValue: 'link',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Parent (submenu)', value: 'parent' },
          ],
        },

        link({
          appearances: [appearanceOptions.default, appearanceOptions.inlinePrimary].map(
            (option) => option.value,
          ),
          overrides: {
            admin: {
              condition: (_, sibling) => sibling?.itemType === 'link',
            },
          },
        }),
        {
          name: 'appearance',
          type: 'select',
          options: [
            appearanceOptions.primary,
            appearanceOptions.default,
            appearanceOptions.primaryOverlap,
          ].map((option) => option.value),
          admin: {
            condition: (_, sibling) => sibling?.itemType === 'parent',
          },
        },
        {
          name: 'subItems',
          type: 'array',
          admin: {
            condition: (_, sibling) => sibling?.itemType === 'parent',
          },

          fields: [link({ appearances: false })],
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}

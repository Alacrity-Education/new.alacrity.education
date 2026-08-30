import type { GlobalConfig } from 'payload'

import {
  BoldFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  ParagraphFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { appearanceOptions, link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

/**
 * Dropdown item content. h2 is the largest heading on offer — it is the item
 * title in the panel, not a page-level heading, and the frontend renders it at
 * a fixed 15px regardless.
 *
 * No LinkFeature on purpose: the whole item is already wrapped in an anchor,
 * and a link inside a link is invalid HTML.
 */
const dropdownItemEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    InlineToolbarFeature(),
  ],
})

const isParent = (_: unknown, sibling: any) => sibling?.itemType === 'parent'
const isLink = (_: unknown, sibling: any) => sibling?.itemType === 'link'

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
          appearances: ['primary', 'default', 'baseOverlap'],
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
            { label: 'Parent (dropdown)', value: 'parent' },
          ],
        },

        // ---- itemType: 'link' -------------------------------------------------
        link({
          appearances: [
            appearanceOptions.default,
            appearanceOptions.baseOverlap,
            appearanceOptions.primary,
          ].map((option) => option.value),
          overrides: {
            admin: {
              condition: isLink,
            },
          },
        }),

        // ---- itemType: 'parent' -----------------------------------------------
        {
          type: 'row',
          admin: {
            condition: isParent,
          },
          fields: [
            {
              name: 'label',
              label: 'Trigger label',
              type: 'text',
              admin: {
                width: '50%',
                condition: isParent,
              },
            },
            {
              name: 'appearance',
              label: 'Trigger appearance',
              type: 'select',
              defaultValue: 'default',
              options: [
                appearanceOptions.primary,
                appearanceOptions.default,
                appearanceOptions.baseOverlap,
              ].map((option) => option.value),
              admin: {
                width: '50%',
                condition: isParent,
              },
            },
          ],
        },
        {
          name: 'columns',
          label: 'Dropdown columns',
          labels: {
            singular: 'Column',
            plural: 'Columns',
          },
          type: 'array',
          maxRows: 2,
          admin: {
            condition: isParent,
            description:
              'One or two columns. The dropdown panel is a fixed-width, screen-centred panel — a single column spans it, two columns split it evenly.',
            initCollapsed: true,
            components: {
              RowLabel: '@/Header/RowLabel#ColumnRowLabel',
            },
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              admin: {
                description: 'Optional column heading. Leave empty for an unlabelled column.',
              },
            },
            {
              name: 'links',
              type: 'array',
              labels: {
                singular: 'Link',
                plural: 'Links',
              },
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/Header/RowLabel#SubItemRowLabel',
                },
              },
              fields: [
                {
                  name: 'content',
                  type: 'richText',
                  required: true,
                  editor: dropdownItemEditor,
                  admin: {
                    description:
                      'Heading (h2/h3/h4) for the item title, plus an optional paragraph beneath it. The paragraph is clamped to two lines in the dropdown.',
                  },
                },
                // No label — the content above is the label. This is purely the
                // destination the whole item points at.
                link({ appearances: false, disableLabel: true }),
              ],
            },
          ],
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

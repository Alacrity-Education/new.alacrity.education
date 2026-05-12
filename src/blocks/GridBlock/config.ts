import type { Block, GroupField } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const cellRichTextEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const GridBlock: Block = {
  slug: 'gridBlock',
  interfaceName: 'GridBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          options: [
            { label: 'Base (white)', value: 'base' },
            { label: 'Primary', value: 'primary' },
          ],
          defaultValue: 'primary',
          admin: { width: '34%' },
        },
        {
          name: 'columns',
          type: 'number',
          min: 1,
          max: 6,
          defaultValue: 4,
          admin: {
            width: '33%',
            description: 'Number of columns (desktop)',
          },
        },
        {
          name: 'rows',
          type: 'number',
          min: 1,
          max: 3,
          defaultValue: 1,
          admin: {
            width: '33%',
            description: 'Number of rows (1–3)',
          },
        },
      ],
    },
    {
      name: 'cells',
      type: 'array',
      label: 'Cells',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'cellType',
              type: 'select',
              options: [
                { label: 'Text', value: 'text' },
                { label: 'Text + Image', value: 'textImage' },
                { label: 'Link', value: 'link' },
              ],
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'colSpan',
              type: 'number',
              min: 1,
              max: 6,
              defaultValue: 1,
              label: 'Cols (desktop)',
              admin: { width: '16%' },
            },
            {
              name: 'rowSpan',
              type: 'number',
              min: 1,
              max: 3,
              defaultValue: 1,
              label: 'Rows (desktop)',
              admin: { width: '16%' },
            },
            {
              name: 'colSpanMobile',
              type: 'number',
              min: 1,
              max: 4,
              defaultValue: 1,
              label: 'Cols (mobile)',
              admin: { width: '16%' },
            },
            {
              name: 'rowSpanMobile',
              type: 'number',
              min: 1,
              max: 3,
              defaultValue: 1,
              label: 'Rows (mobile)',
              admin: { width: '16%' },
            },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          label: false,
          editor: cellRichTextEditor,
        },
        {
          name: 'media',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.cellType === 'textImage',
          },
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.cellType === 'link',
            },
          } as Partial<GroupField>,
        }),
      ],
    },
  ],
  labels: {
    plural: 'Grid Blocks',
    singular: 'Grid Block',
  },
}

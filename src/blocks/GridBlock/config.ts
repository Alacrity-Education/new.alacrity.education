import type { Block, GroupField } from 'payload'

import {
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const descriptionEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
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
          admin: { width: '50%' },
        },
        {
          name: 'rows',
          type: 'select',
          label: 'Grid Layout',
          options: [
            { label: 'Single row (4 cells)', value: '1' },
            { label: 'Two rows (8 cells)', value: '2' },
          ],
          defaultValue: '1',
          admin: {
            width: '50%',
            description: 'Add 4 cells for a single row, or 8 cells for two rows at full width',
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
          name: 'cellType',
          type: 'select',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Text + Image', value: 'textImage' },
            { label: 'Link', value: 'link' },
          ],
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Stat Title',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
          editor: descriptionEditor,
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

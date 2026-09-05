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
          type: 'number',
          label: 'Grid Layout',

          defaultValue: 1,
          max:3,
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
          label: 'Background image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional, and available on both cell types. The cell text is drawn over the image on an overlay and switches to white.',
          },
        },
        {
          name: 'overlay',
          type: 'select',
          label: 'Image overlay',
          defaultValue: 'dark',
          options: [
            { label: 'Dark', value: 'dark' },
            { label: 'Primary', value: 'primary' },
          ],
          admin: {
            // Only meaningful with an image behind it.
            condition: (_, siblingData) => Boolean(siblingData?.media),
            description: 'Tints the image so the white text stays legible.',
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

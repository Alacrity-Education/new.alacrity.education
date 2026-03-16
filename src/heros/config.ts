import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    // ✨ ONE UNIFIED LAYOUT BLOCK ✨
    {
      name: 'layout',
      type: 'group',
      label: 'Layout & Styling',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'textPosition',
              type: 'select',
              label: 'Text Alignment',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
            {
              name: 'imagePosition',
              type: 'select',
              label: 'Image Position',
              defaultValue: 'right',
              admin: {
                // Now checks your primary 'media' field to see if it should show up!
                condition: (data) => Boolean(data?.hero?.media),
              },
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Background Color',
              admin: { description: 'Use Hex, RGB, or names (e.g., #ffffff, black, transparent)' },
            },
            {
              name: 'textColor',
              type: 'text',
              label: 'Text Color',
              admin: { description: 'Use Hex, RGB, or names (e.g., #000000, white)' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'imageWidth',
              type: 'text',
              label: 'Image Width',
              admin: { description: 'e.g., 100%, 500px, 20rem' },
            },
            {
              name: 'imageHeight',
              type: 'text',
              label: 'Image Height',
              admin: { description: 'e.g., auto, 400px, 100%' },
            },
          ],
        },
        {
          name: 'padding',
          type: 'group',
          label: 'Padding (Use CSS values like 2rem, 20px, etc.)',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'top', type: 'text', label: 'Top', defaultValue: '0px' },
                { name: 'right', type: 'text', label: 'Right', defaultValue: '0px' },
                { name: 'bottom', type: 'text', label: 'Bottom', defaultValue: '0px' },
                { name: 'left', type: 'text', label: 'Left', defaultValue: '0px' },
              ],
            },
          ],
        },
      ],
    },
  ],
  label: false,
}

import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '../../fields/link'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'variant',
      type: 'select',
      options: ['base', 'primary'],
      defaultValue: 'base',
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 2,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'ctaType',
          type: 'select',
          label: 'Type',
          defaultValue: 'link',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Open Form (modal)', value: 'form' },
          ],
        },
        link({
          appearances: ['primary', 'baseOverlap', 'default', 'primaryOverlap'],
          overrides: {
            admin: {
              hideGutter: true,
              condition: (_, siblingData) => siblingData?.ctaType !== 'form',
            },
          },
        }),
        {
          name: 'formCta',
          type: 'group',
          label: 'Form Button',
          admin: {
            hideGutter: true,
            condition: (_, siblingData) => siblingData?.ctaType === 'form',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Button Label',
              required: true,
            },
            {
              name: 'appearance',
              type: 'select',
              label: 'Appearance',
              defaultValue: 'primary',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Primary', value: 'primary' },
                { label: 'Primary Overlap', value: 'primaryOverlap' },
                { label: 'Base Overlap', value: 'baseOverlap' },
              ],
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
              label: 'Form',
            },
          ],
        },
      ],
    },
    {
      name: 'media',
      label: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}

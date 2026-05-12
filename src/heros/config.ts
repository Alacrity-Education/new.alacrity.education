import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  TextStateFeature,
  defaultColors,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'


export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'highImpact',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Slide', value: 'slide' },
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
            TextStateFeature({
              state: {
                color: {
                  primary: {
                    label: 'Primary',
                    css: {
                      color: 'purple',
                    },
                  },
                  secondary: {
                    label: 'Secondary',
                    css: {
                      color: 'pink',
                    },
                  },
                  arrowHighlighted: {
                    label: 'Arrow Highlighted',
                    css: {
                      color: 'blue',
                    },
                  },
                },
              },
            }),
          ]
        },
      }),
      label: false,
    },
    {
      type: 'group',
      label: 'Call To Action',
      name: 'cta',
      fields: [
        {
          type: 'select',
          name: 'selectCTA',
          label: 'Select Call To Action',
          options: ['None', 'Button'],
          defaultValue: 'None',
        },
        linkGroup({
          overrides: {
            maxRows: 2,
            admin: {
              condition: (_, { selectCTA } = {}) => {

                return ['Button'].includes(selectCTA)
              },
            },
          },
        }),
      ],
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}

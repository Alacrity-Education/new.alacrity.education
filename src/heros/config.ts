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
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
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
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'slide'].includes(type),
      },
      relationTo: 'media',
      required: false,
    },
    {
      name: 'imageVariant',
      type: 'select',
      label: 'Image Shape',
      defaultValue: 'rectangle',
      options: [
        { label: 'Rectangle', value: 'rectangle' },
        { label: 'Circle', value: 'circle' },
      ],
      admin: {
        condition: (_, { media, type } = {}) =>
          Boolean(media) && ['highImpact', 'slide'].includes(type),
      },
    },
  ],
  label: false,
}

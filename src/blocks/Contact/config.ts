import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ContactBlock: Block = {
  slug: 'contactBlock',
  interfaceName: 'ContactBlock',
  labels: { singular: 'Contact Section', plural: 'Contact Sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Write a message',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: { description: 'Select a form created via the Form Builder.' },
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Intro Content',
    },
    {
      name: 'map',
      type: 'group',
      label: 'Map Location',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              required: true,
              admin: { width: '50%', placeholder: 'e.g. 44.446075', step: 0.000001 },
            },
            {
              name: 'longitude',
              type: 'number',
              required: true,
              admin: { width: '50%', placeholder: 'e.g. 26.094224', step: 0.000001 },
            },
          ],
        },
        { name: 'zoom', type: 'number', defaultValue: 14, min: 1, max: 20 },
        { name: 'markerLabel', type: 'text' },
        {
          name: 'markerSubtitle',
          type: 'text',
          admin: { description: 'Address shown under the label in the popup.' },
        },
        {
          name: 'openInMapsUrl',
          type: 'text',
          admin: {
            description:
              'Optional. If empty, a Google Maps link is generated from the coordinates.',
          },
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Contact Us' },
        {
          type: 'row',
          fields: [
            { name: 'phone', type: 'text', admin: { width: '60%' } },
            {
              name: 'phoneLabel',
              type: 'text',
              admin: { width: '40%', description: 'e.g. "(Vavilov Iris)"' },
            },
          ],
        },
        { name: 'email', type: 'email' },
      ],
    },
  ],
}

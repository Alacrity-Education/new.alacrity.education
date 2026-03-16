import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
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
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
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
      label: 'Intro Content',
    },
    {
      name: 'enableMap',
      type: 'checkbox',
      label: 'Enable Map',
      admin: {
        description: 'Show interactive map on the right side (requires map component)',
      },
    },
    {
      type: 'collapsible',
      admin: { condition: (_, sibling) => sibling?.enableMap },
      label: 'Map Location',
      fields: [
        {
          name: 'mapLatitude',
          type: 'number',
          label: 'Map Latitude',
          admin: {
            placeholder: 'e.g., 44.446075',
            step: 0.000001,
          },
          required: true,
        },
        {
          name: 'mapLongitude',
          type: 'number',
          label: 'Map Longitude',
          admin: {
            placeholder: 'e.g., 26.094224',
            step: 0.000001,
          },
          required: true,
        },
        {
          name: 'enableContactInfo',
          type: 'checkbox',
          label: 'Enable Contact Information',
          admin: {
            description: 'Show contact information section below the map',
          },
        },
        {
          type: 'collapsible',
          admin: { condition: (_, sibling) => sibling?.enableContactInfo },
          label: 'Contact Information',
          fields: [
            {
              name: 'contactTitle',
              type: 'text',
              label: 'Contact Section Title',
              admin: {
                placeholder: 'e.g., Contact Us',
              },
              required: false,
            },
            {
              name: 'contactPhone',
              type: 'text',
              label: 'Phone Number',
              admin: {
                placeholder: 'e.g., +40 736 382 448',
              },
              required: false,
            },
            {
              name: 'contactPhoneHref',
              type: 'text',
              label: 'Phone Link (tel: format)',
              admin: {
                placeholder: 'e.g., tel:+40736382448',
              },
              required: false,
            },
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Contact Email',
              admin: {
                placeholder: 'e.g., contact@alacrity.ro',
              },
              required: false,
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}

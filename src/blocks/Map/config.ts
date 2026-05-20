import type { Block } from 'payload'

export const MapBlock: Block = {
  slug: 'mapBlock',
  interfaceName: 'MapBlock',
  labels: { singular: 'Map', plural: 'Maps' },
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
    {
      name: 'zoom',
      type: 'number',
      defaultValue: 14,
      min: 1,
      max: 20,
    },
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
        description: 'Optional. If empty, a Google Maps link is generated from the coordinates.',
      },
    },
    {
      name: 'showContactCard',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show Contact Info Card',
    },
    {
      name: 'contactCard',
      type: 'group',
      admin: { condition: (_, siblingData) => Boolean(siblingData?.showContactCard) },
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

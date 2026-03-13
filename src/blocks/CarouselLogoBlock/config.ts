import type { Block } from 'payload'

export const SponsorPartnerBlockConfig: Block = {
  slug: 'sponsorPartnerBlock',
  interfaceName: 'SponsorPartnerBlock',
  fields: [
    {
      name: 'blockType',
      type: 'text',
      defaultValue: 'sponsorPartnerBlock',
      admin: {
        hidden: true,
        description: 'The block which displays all sponsors and partners of Alacrity',
      },
    },
    {
      name: 'sponsorText',
      type: 'text',
      label: 'Sponsor Section Text',
    },
    {
      name: 'partnerText',
      type: 'text',
      label: 'Partner Section Text',
    },
  ],
}

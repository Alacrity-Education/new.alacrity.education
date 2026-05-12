import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

export type LinkAppearances =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'inlinePrimary'
  | 'inline'
  | 'primaryOverlap'
  | 'baseOverlap'

export const LinkAppearanceVariants = {
  inlinePrimary: 'bg-primary text-primary-content p-2 rounded-lg px-3 lg:btn text-start active:invert hover:bg-primary/50',
  inline: ''
}

export const appearanceOptions: Record<LinkAppearances, { label: string; value: LinkAppearances }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  primary: {
    label: 'Primary',
    value: 'primary',
  },
  secondary: {
    label: 'Secondary',
    value: 'secondary',
  },
  ghost: {
    label: 'Ghost',
    value: 'ghost',
  },
  inlinePrimary: {
    label: 'Inline Primary',
    value: 'inlinePrimary',
  },
  inline: {
    label: 'Inline',
    value: 'inline',
  },
  primaryOverlap: {
    label: 'Primary Overlap',
    value: 'primaryOverlap',
  },
  baseOverlap: {
    label: 'Base Overlap',
    value: 'baseOverlap',
  },
} as const;

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      relationTo: ['pages', 'posts'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.primary,
      appearanceOptions.secondary,
      appearanceOptions.ghost,
      appearanceOptions.inlinePrimary,
      appearanceOptions.inline,
      appearanceOptions.primaryOverlap,
      appearanceOptions.baseOverlap,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}

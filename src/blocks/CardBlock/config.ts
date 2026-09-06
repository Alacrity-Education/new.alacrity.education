import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'

const cardRichTextEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

/**
 * The three variants take different content, so each gets its own array rather
 * than one array of conditionally-shown fields. Payload's `admin.condition`
 * receives `(data, siblingData)`, and for a field *inside* an array row the
 * siblings are that row — there is no way to read the block's `variant` from in
 * there. At array level `variant` IS a sibling, so the condition works.
 *
 * `variant` is absent on rows created before it existed, hence the
 * `?? 'carousel'` fallback: those are all carousels.
 */
const isVariant = (want: string) => (_: unknown, siblingData: Record<string, unknown>) =>
  ((siblingData?.variant as string) ?? 'carousel') === want

export const CardBlock: Block = {
  slug: 'cardBlock',
  interfaceName: 'CardBlock',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'carousel',
      options: [
        { label: 'Carousel', value: 'carousel' },
        { label: 'Featured', value: 'featured' },
        { label: 'Big', value: 'big' },
      ],
      admin: {
        description:
          'Carousel: horizontally scrolling cards. Featured: full-width cards that pin and scale on scroll (md and up). Big: see BigVariant.tsx.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },

    // ── Carousel ────────────────────────────────────────────────────────────
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      admin: { condition: isVariant('carousel') },
      fields: [
        {
          name: 'variant',
          type: 'select',
          label: 'Variant',
          defaultValue: 'base',
          options: [
            { label: 'Base', value: 'base' },
            { label: 'Primary', value: 'primary' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
        link({
          appearances: ['default', 'primary', 'baseOverlap', 'primaryOverlap'],
        }),
      ],
    },

    // ── Featured (was the standalone fcardsBlock) ───────────────────────────
    {
      name: 'featuredCards',
      type: 'array',
      label: 'Featured Cards',
      // Postgres caps identifiers at 63 chars. Nested under cardBlock, the
      // default naming yields
      // `enum_pages_blocks_card_block_featured_cards_links_link_appearance`
      // (65) and Payload refuses to build the schema. `fcards` shortens the
      // segment — and matches the old fcardsBlock naming, which keeps the data
      // migration legible. The longest name it produces is
      // `enum_card_block_fcards_links_link_appearance` (44).
      dbName: 'card_block_fcards',
      admin: { condition: isVariant('featured') },
      fields: [
        {
          name: 'richText',
          type: 'richText',
          label: false,
          editor: cardRichTextEditor,
        },
        {
          name: 'gallery',
          type: 'array',
          label: 'Gallery Images',
          maxRows: 7,
          admin: {
            description:
              'First image is shown on the card. Up to 7 total — hovering the card fans out a photo stack; clicking opens the full gallery.',
          },
          fields: [
            {
              name: 'image',
              label: 'Image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        linkGroup({
          appearances: ['primary', 'baseOverlap', 'default', 'primaryOverlap'],
          overrides: { maxRows: 3 },
        }),
      ],
    },

    // ── Big ─────────────────────────────────────────────────────────────────
    {
      name: 'bigCards',
      type: 'array',
      label: 'Big Cards',
      admin: {
        condition: isVariant('big'),
        description:
          'Tall violet panels, two across. The h2 in the rich text is the card heading — there is no separate title field.',
      },
      fields: [
        {
          // Same editor as the featured variant: h2 is the largest heading on
          // offer, since anything above it competes with the section title.
          name: 'richText',
          type: 'richText',
          label: false,
          editor: cardRichTextEditor,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background image',
          admin: {
            description:
              'Optional. Sits behind the card under a primary tint that keeps the white text legible.',
          },
        },
        {
          name: 'backgroundType',
          type: 'select',
          label: 'Background coverage',
          defaultValue: 'full',
          options: [
            { label: 'Full', value: 'full' },
            { label: 'Partial', value: 'partial' },
          ],
          admin: {
            // Meaningless without something to cover the card with.
            condition: (_, siblingData) => Boolean(siblingData?.image),
            description:
              'Full bleeds the image behind the whole card with the text over it. Partial puts the image in the lower 3/5 with the text above it.',
          },
        },
        // No appearance options: this renders as a text link, never a button.
        link({ appearances: false }),
      ],
    },
  ],
  labels: {
    plural: 'Card Sections',
    singular: 'Card Section',
  },
}

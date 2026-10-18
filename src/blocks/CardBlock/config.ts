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
      defaultValue: 'regular',
      options: [
        { label: 'Regular', value: 'regular' },
        { label: 'Featured', value: 'featured' },
        { label: 'Big', value: 'big' },
      ],
      admin: {
        description:
          'Regular and Big render the same cards differently — switching between them keeps what you have entered. Featured is its own set: full-width cards that pin and scale on scroll from lg up.',
      },
    },
    {
      // Shared by regular and big: both render the same cards either as a
      // horizontal scroller or as a grid, so one field drives both rather than
      // two that would have to be kept in step.
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
      admin: {
        condition: (_, siblingData) =>
          siblingData?.variant === 'regular' || siblingData?.variant === 'big',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },

    // ── Cards: regular and big ──────────────────────────────────────────────
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      // Both variants read this one array, so switching between them keeps
      // the content — they used to hold separate arrays, and the editor went
      // blank on every switch because the other one was empty. What the
      // variant chooses now is only how these are rendered.
      admin: {
        condition: (_, siblingData) =>
          isVariant('regular')(_, siblingData) || isVariant('big')(_, siblingData),
      },
      fields: [
        // The card renders the title as an h2 and the description as body
        // copy, scaled to the card by .prose-card. Headings above h2 are not
        // on offer, same as the featured variant.
        {
          name: 'title',
          type: 'richText',
          label: 'Title',
          // Not required. A big card's heading was optional — its copy was one
          // rich text field with no rule about opening with a heading — and
          // those cards live in this array now. Requiring it would make every
          // such card fail validation on the next save of a page that has one.
          // A card without a title simply renders no heading.
          editor: cardRichTextEditor,
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
          editor: cardRichTextEditor,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          admin: {
            description:
              'Fills the card behind the copy. Without one the card is plain primary.',
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
            // Meaningless without something to cover the card with. It cannot
            // also be conditioned on the variant: inside an array row the
            // siblings are the row, so `variant` is not reachable from here —
            // the same reason each variant used to need its own array. The
            // regular variant ignores the value.
            condition: (_, siblingData) => Boolean(siblingData?.image),
            description:
              'Big variant only. Full bleeds the image behind the whole card with the text over it; Partial puts it in the lower 3/5 with the text above.',
          },
        },
        // No appearance choice: these cards are a single treatment now, and the
        // block renders the link itself so it stays legible over the tint.
        link({ appearances: false }),
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

  ],
  labels: {
    plural: 'Card Sections',
    singular: 'Card Section',
  },
}

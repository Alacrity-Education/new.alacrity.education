# GridBlock Layout Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all span/colspan/rowspan logic from the GridBlock, replacing it with a fixed `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` responsive layout and larger description text.

**Architecture:** Two file changes — `config.ts` drops `columns` + all cell span fields and replaces `rows` (number) with `rows` (select: `'1'`|`'2'`), `Component.tsx` strips all span maps and aspect-ratio logic down to a plain responsive grid. Type regeneration after schema change.

**Tech Stack:** Payload CMS, TypeScript, Next.js, Tailwind CSS, @payloadcms/richtext-lexical

---

## File Map

| File | Action | Notes |
|------|--------|-------|
| `src/blocks/GridBlock/config.ts` | Modify | Remove `columns`, cell span fields; replace `rows` number with `rows` select |
| `src/blocks/GridBlock/Component.tsx` | Modify | Remove span maps, aspect-ratio logic; fixed responsive grid; larger description text |
| `src/payload-types.ts` | Regenerated | Run `pnpm generate:types` |

---

### Task 1: Simplify config.ts

**Files:**
- Modify: `src/blocks/GridBlock/config.ts`

- [ ] **Step 1: Replace config.ts**

Full file content:

```typescript
import type { Block, GroupField } from 'payload'

import {
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const descriptionEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    InlineToolbarFeature(),
  ],
})

export const GridBlock: Block = {
  slug: 'gridBlock',
  interfaceName: 'GridBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          options: [
            { label: 'Base (white)', value: 'base' },
            { label: 'Primary', value: 'primary' },
          ],
          defaultValue: 'primary',
          admin: { width: '50%' },
        },
        {
          name: 'rows',
          type: 'select',
          options: [
            { label: 'Single row (4 cells)', value: '1' },
            { label: 'Two rows (8 cells)', value: '2' },
          ],
          defaultValue: '1',
          admin: {
            width: '50%',
            description: 'How many rows of stats to show at desktop width',
          },
        },
      ],
    },
    {
      name: 'cells',
      type: 'array',
      label: 'Cells',
      fields: [
        {
          name: 'cellType',
          type: 'select',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Text + Image', value: 'textImage' },
            { label: 'Link', value: 'link' },
          ],
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Stat Title',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
          editor: descriptionEditor,
        },
        {
          name: 'media',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.cellType === 'textImage',
          },
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.cellType === 'link',
            },
          } as Partial<GroupField>,
        }),
      ],
    },
  ],
  labels: {
    plural: 'Grid Blocks',
    singular: 'Grid Block',
  },
}
```

- [ ] **Step 2: Regenerate types**

```bash
pnpm generate:types
```

Expected: `src/payload-types.ts` `GridBlock` interface loses `columns`, `colSpan`, `rowSpan`, `colSpanMobile`, `rowSpanMobile`; `rows` changes from `number | null` to `('1' | '2') | null`.

- [ ] **Step 3: Commit**

```bash
git add src/blocks/GridBlock/config.ts src/payload-types.ts
git commit -m "feat: simplify GridBlock schema — remove span fields, rows becomes 1/2 select"
```

---

### Task 2: Simplify Component.tsx

**Files:**
- Modify: `src/blocks/GridBlock/Component.tsx`

- [ ] **Step 1: Replace Component.tsx**

Full file content:

```typescript
import React from 'react'
import Link from 'next/link'

import type { GridBlock as GridBlockProps } from '@/payload-types'
import type { Page, Post } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const containerBg: Record<string, string> = {
  base: 'bg-base-100 border-2 border-base-300',
  primary: 'bg-primary',
}
const titleClass: Record<string, string> = {
  base: 'text-base-content',
  primary: 'text-primary-content',
}
const descriptionProseClass: Record<string, string> = {
  base: 'text-base lg:text-lg xl:text-xl',
  primary: 'text-base lg:text-lg xl:text-xl [&_p]:text-primary-content',
}
const linkCellBg: Record<string, string> = {
  base: 'bg-primary hover:bg-primary/90',
  primary: 'bg-base-100 text-base-content hover:bg-base-200',
}
const linkCellTitleClass: Record<string, string> = {
  base: 'text-primary-content',
  primary: '',
}
const linkCellProseClass: Record<string, string> = {
  base: 'text-base lg:text-lg xl:text-xl [&_p]:text-primary-content',
  primary: 'text-base lg:text-lg xl:text-xl',
}

const noProseMargins = '[&_p]:!my-0'

type LinkField = NonNullable<NonNullable<GridBlockProps['cells']>[0]['link']>

function resolveLinkHref(link: LinkField | null | undefined): string {
  if (!link) return '#'
  if (
    link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value !== null &&
    'slug' in link.reference.value
  ) {
    const prefix = link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''
    return `${prefix}/${(link.reference.value as Page | Post).slug}`
  }
  return link.url ?? '#'
}

export const GridBlock: React.FC<GridBlockProps> = ({
  variant = 'primary',
  cells,
}) => {
  const v = (variant ?? 'primary') as 'base' | 'primary'

  return (
    <div className="container">
      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 rounded-2xl p-3 sm:p-8',
          containerBg[v],
        )}
      >
        {(cells ?? []).map((cell, i) => {
          // ── Text cell ────────────────────────────────────────────────────
          if (cell.cellType === 'text') {
            return (
              <div key={i} className="flex flex-col rounded-xl p-4 sm:p-6">
                {cell.title && (
                  <p className={cn('text-4xl sm:text-5xl font-bold mb-2', titleClass[v])}>
                    {cell.title}
                  </p>
                )}
                {cell.description && (
                  <RichText
                    className={cn('mb-0 w-full mx-0', descriptionProseClass[v], noProseMargins)}
                    data={cell.description}
                    enableGutter={false}
                    enableProse={false}
                  />
                )}
              </div>
            )
          }

          // ── Text + Image cell ─────────────────────────────────────────────
          if (cell.cellType === 'textImage') {
            return (
              <div key={i} className="relative rounded-xl overflow-hidden min-h-48 sm:min-h-64">
                {cell.media && (
                  <Media
                    className="absolute inset-0 w-full h-full"
                    imgClassName="w-full h-full object-cover"
                    resource={cell.media}
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/50 to-black/20" />
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
                  {cell.title && (
                    <p className="text-4xl sm:text-5xl font-bold mb-2 text-primary-content">
                      {cell.title}
                    </p>
                  )}
                  {cell.description && (
                    <RichText
                      className={cn('mb-0 w-full mx-0 text-base lg:text-lg xl:text-xl [&_p]:text-primary-content', noProseMargins)}
                      data={cell.description}
                      enableGutter={false}
                      enableProse={false}
                    />
                  )}
                </div>
              </div>
            )
          }

          // ── Link cell ─────────────────────────────────────────────────────
          if (cell.cellType === 'link') {
            const href = resolveLinkHref(cell.link)
            const newTabProps = cell.link?.newTab
              ? { rel: 'noopener noreferrer' as const, target: '_blank' as const }
              : {}

            return (
              <Link
                key={i}
                href={href}
                {...newTabProps}
                className={cn(
                  'group flex flex-col rounded-xl p-4 sm:p-6 transition-colors',
                  linkCellBg[v],
                )}
              >
                <div className="flex justify-end">
                  <span className="text-5xl font-bold leading-none transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </div>
                <div className="flex-1" />
                {cell.title && (
                  <p className={cn('text-2xl font-bold mb-2', linkCellTitleClass[v])}>
                    {cell.title}
                  </p>
                )}
                {cell.description && (
                  <RichText
                    className={cn('mb-0 w-full mx-0', linkCellProseClass[v], noProseMargins)}
                    data={cell.description}
                    enableGutter={false}
                    enableProse={false}
                  />
                )}
              </Link>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: No errors in `src/blocks/GridBlock/Component.tsx`. Pre-existing errors in unrelated files (seed, pagination, revalidation) are acceptable.

- [ ] **Step 3: Commit**

```bash
git add src/blocks/GridBlock/Component.tsx
git commit -m "feat: simplify GridBlock layout — responsive 1/2/4 col grid, larger description text"
```

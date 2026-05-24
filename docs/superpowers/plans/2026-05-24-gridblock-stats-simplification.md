# GridBlock Stats Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the GridBlock's per-cell `richText` field with `title` (plain text) and `description` (inline-only rich text), simplifying it into a focused stats section.

**Architecture:** Two files change — `config.ts` swaps one richText field for two simpler fields, `Component.tsx` renders the new fields. All three cell types (text, textImage, link) are structurally preserved. After schema changes, types are regenerated and the import map is rebuilt.

**Tech Stack:** Payload CMS, TypeScript, Next.js, Tailwind CSS, @payloadcms/richtext-lexical

---

## File Map

| File | Action | Notes |
|------|--------|-------|
| `src/blocks/GridBlock/config.ts` | Modify | Remove `cellRichTextEditor` + `richText`; add `title` (text) + `description` (inline richText) |
| `src/blocks/GridBlock/Component.tsx` | Modify | Render `cell.title` and `cell.description` instead of `cell.richText`; simplify theming maps |
| `src/payload-types.ts` | Regenerated | Run `pnpm generate:types` |
| `src/app/(payload)/admin/importMap.js` | Regenerated | Run `pnpm generate:importmap` |

---

### Task 1: Update config.ts schema

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
          admin: { width: '34%' },
        },
        {
          name: 'columns',
          type: 'number',
          min: 1,
          max: 6,
          defaultValue: 4,
          admin: {
            width: '33%',
            description: 'Number of columns (desktop)',
          },
        },
        {
          name: 'rows',
          type: 'number',
          min: 1,
          max: 3,
          defaultValue: 1,
          admin: {
            width: '33%',
            description: 'Number of rows (1–3)',
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
          type: 'row',
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
              admin: { width: '20%' },
            },
            {
              name: 'colSpan',
              type: 'number',
              min: 1,
              max: 6,
              defaultValue: 1,
              label: 'Cols (desktop)',
              admin: { width: '16%' },
            },
            {
              name: 'rowSpan',
              type: 'number',
              min: 1,
              max: 3,
              defaultValue: 1,
              label: 'Rows (desktop)',
              admin: { width: '16%' },
            },
            {
              name: 'colSpanMobile',
              type: 'number',
              min: 1,
              max: 4,
              defaultValue: 1,
              label: 'Cols (mobile)',
              admin: { width: '16%' },
            },
            {
              name: 'rowSpanMobile',
              type: 'number',
              min: 1,
              max: 3,
              defaultValue: 1,
              label: 'Rows (mobile)',
              admin: { width: '16%' },
            },
          ],
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

- [ ] **Step 2: Regenerate Payload types**

```bash
pnpm generate:types
```

Expected: `src/payload-types.ts` updates the `GridBlock` interface — `richText` field disappears, replaced by `title?: string | null` and `description?: { root: ... } | null`.

---

### Task 2: Update Component.tsx

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

const mobileColClass: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
}
const desktopColClass: Record<number, string> = {
  1: 'xl:col-span-1',
  2: 'xl:col-span-2',
  3: 'xl:col-span-3',
  4: 'xl:col-span-4',
  5: 'xl:col-span-5',
  6: 'xl:col-span-6',
}
const mobileRowClass: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
}
const desktopRowClass: Record<number, string> = {
  1: 'xl:row-span-1',
  2: 'xl:row-span-2',
  3: 'xl:row-span-3',
}
const desktopGridColsClass: Record<number, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
}

const containerBg: Record<string, string> = {
  base: 'bg-base-100 border-2 border-base-300',
  primary: 'bg-primary',
}
const titleClass: Record<string, string> = {
  base: 'text-base-content',
  primary: 'text-primary-content',
}
const descriptionProseClass: Record<string, string> = {
  base: 'prose-sm sm:prose-base',
  primary: 'prose-sm sm:prose-base prose-p:text-primary-content',
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
  base: 'prose-p:text-primary-content',
  primary: '',
}

const noProseMargins = 'prose-p:!my-0'
const aspectRatioClass = '[aspect-ratio:var(--aspect-mobile)] lg:[aspect-ratio:var(--aspect-desktop)]'

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
  columns = 4,
  cells,
}) => {
  const v = (variant ?? 'primary') as 'base' | 'primary'
  const cols = Math.max(1, Math.min(6, columns ?? 4))

  return (
    <div className="container">
      <div
        className={cn(
          'grid grid-cols-2 gap-3 sm:gap-8 rounded-2xl p-3 sm:p-8',
          desktopGridColsClass[cols],
          containerBg[v],
        )}
      >
        {(cells ?? []).map((cell, i) => {
          const colSpan = Math.max(1, Math.min(6, cell.colSpan ?? 1))
          const rowSpan = Math.max(1, Math.min(3, cell.rowSpan ?? 1))
          const colSpanMobile = Math.max(1, Math.min(4, cell.colSpanMobile ?? 1))
          const rowSpanMobile = Math.max(1, Math.min(3, cell.rowSpanMobile ?? 1))

          const spanClasses = cn(
            mobileColClass[colSpanMobile],
            desktopColClass[colSpan],
            mobileRowClass[rowSpanMobile],
            desktopRowClass[rowSpan],
          )

          const cellAspectStyle = {
            '--aspect-mobile': `${colSpanMobile} / ${rowSpanMobile}`,
            '--aspect-desktop': `${colSpan} / ${rowSpan}`,
          } as React.CSSProperties

          // ── Text cell ────────────────────────────────────────────────────
          if (cell.cellType === 'text') {
            return (
              <div
                key={i}
                className={cn('flex flex-col rounded-xl p-4 sm:p-6', aspectRatioClass, spanClasses)}
                style={cellAspectStyle}
              >
                {cell.title && (
                  <p className={cn('text-4xl sm:text-5xl font-bold mb-2', titleClass[v])}>
                    {cell.title}
                  </p>
                )}
                {cell.description && (
                  <RichText
                    className={cn('mb-0 w-full mx-0!', descriptionProseClass[v], noProseMargins)}
                    data={cell.description}
                    enableGutter={false}
                  />
                )}
              </div>
            )
          }

          // ── Text + Image cell ─────────────────────────────────────────────
          if (cell.cellType === 'textImage') {
            return (
              <div
                key={i}
                className={cn('relative rounded-xl overflow-hidden', aspectRatioClass, spanClasses)}
                style={cellAspectStyle}
              >
                {cell.media && (
                  <Media
                    className="absolute inset-0 w-full h-full"
                    imgClassName="w-full h-full object-cover"
                    resource={cell.media}
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/50 to-black/20" />
                <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-6">
                  {cell.title && (
                    <p className="text-4xl sm:text-5xl font-bold mb-2 text-primary-content">
                      {cell.title}
                    </p>
                  )}
                  {cell.description && (
                    <RichText
                      className={cn('mb-0 mx-0 prose-p:text-primary-content', noProseMargins)}
                      data={cell.description}
                      enableGutter={false}
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
                  aspectRatioClass,
                  spanClasses,
                )}
                style={cellAspectStyle}
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

Expected: No errors.

---

### Task 3: Regenerate import map and commit

- [ ] **Step 1: Regenerate import map**

```bash
pnpm generate:importmap
```

Expected: `src/app/(payload)/admin/importMap.js` updated.

- [ ] **Step 2: Commit**

```bash
git add src/blocks/GridBlock/config.ts src/blocks/GridBlock/Component.tsx src/payload-types.ts "src/app/(payload)/admin/importMap.js"
git commit -m "feat: simplify grid block into stats section with title + description per cell"
```

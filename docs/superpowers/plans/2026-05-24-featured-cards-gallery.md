# Featured Cards Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-card gallery (up to 7 images) to `FeaturedCardsBlock`, with a CSS hover stack effect and a full-screen YARL lightbox on click.

**Architecture:** Replace the single `media` upload field on each card with a `gallery` array (max 7). A new `ImageStack` client component handles the stack rendering (CSS `group-hover:` transitions) and the YARL lightbox. `Component.tsx` imports `ImageStack` in place of the old `<Media>` block.

**Tech Stack:** Payload CMS 3.x, Next.js (App Router), Tailwind CSS v4, `yet-another-react-lightbox` (YARL) with Thumbnails + Zoom plugins, project `<Media>` component for all image rendering.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/blocks/FeaturedCardsBlock/config.ts` | Replace `media` upload with `gallery` array (max 7) |
| Modify | `src/payload-types.ts` | Auto-regenerated — do not edit by hand |
| Create | `src/blocks/FeaturedCardsBlock/ImageStack.tsx` | Hover stack + YARL lightbox |
| Modify | `src/blocks/FeaturedCardsBlock/Component.tsx` | Swap `<Media>` for `<ImageStack>` |

---

## Task 1: Install YARL

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install the package**

```bash
npm install yet-another-react-lightbox
```

Expected output: `added N packages` with no errors.

- [ ] **Step 2: Verify the import resolves**

```bash
node -e "require('yet-another-react-lightbox')" && echo "OK"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add yet-another-react-lightbox"
```

---

## Task 2: Update Payload Schema

Replace the single `media` upload field with a `gallery` array in the FeaturedCardsBlock config.

**Files:**
- Modify: `src/blocks/FeaturedCardsBlock/config.ts`

- [ ] **Step 1: Open `src/blocks/FeaturedCardsBlock/config.ts`**

Current content of the `cards` fields array (relevant part):
```ts
{
  name: 'media',
  label: 'Image',
  type: 'upload',
  relationTo: 'media',
},
```

- [ ] **Step 2: Replace the `media` field with a `gallery` array**

Replace ONLY that field definition with:

```ts
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
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
},
```

The full `cards` field array after the change:

```ts
{
  name: 'cards',
  type: 'array',
  label: 'Cards',
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
```

- [ ] **Step 3: Regenerate Payload types**

```bash
npm run generate:types
```

Expected: exits 0, `src/payload-types.ts` updated. The `FeaturedCardsBlock` interface should now have `gallery` instead of `media`.

Verify with:
```bash
grep -A 12 "export interface FeaturedCardsBlock" src/payload-types.ts
```

Expected output includes:
```
gallery?:
  | {
      image: (number | null) | Media;
      id?: string | null;
    }[]
```

- [ ] **Step 4: Regenerate import map**

```bash
npm run generate:importmap
```

- [ ] **Step 5: Commit**

```bash
git add src/blocks/FeaturedCardsBlock/config.ts src/payload-types.ts src/app/\(payload\)/admin/importMap.js
git commit -m "feat: replace media field with gallery array on FeaturedCardsBlock"
```

---

## Task 3: Create `ImageStack` Component

**Files:**
- Create: `src/blocks/FeaturedCardsBlock/ImageStack.tsx`

- [ ] **Step 1: Create the file with this exact content**

```tsx
'use client'
import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

import type { SlideImage } from 'yet-another-react-lightbox'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type MediaSlide = SlideImage & { resource: MediaType }

interface ImageStackProps {
  images: Array<{ image: MediaType | number | null; id?: string | null }>
  className?: string
}

export const ImageStack: React.FC<ImageStackProps> = ({ images, className }) => {
  const [open, setOpen] = useState(false)

  // Only work with fully-populated image objects (not bare IDs)
  const populated = (images ?? []).filter(
    (item): item is { image: MediaType; id?: string | null } =>
      typeof item.image === 'object' && item.image !== null,
  )

  if (populated.length === 0) return null

  const frontImage = populated[0]!
  // 3+ images: back layer (-4deg) + mid layer (+4deg)
  // 2 images:  no back layer, mid layer (+4deg) only
  const backImage = populated.length >= 3 ? populated[1]! : null
  const midImage =
    populated.length >= 2
      ? populated.length >= 3
        ? populated[2]!
        : populated[1]!
      : null

  const hasStack = populated.length >= 2

  const slides: MediaSlide[] = populated.map((item) => ({
    src: item.image.url ?? '',
    resource: item.image,
    width: item.image.width ?? undefined,
    height: item.image.height ?? undefined,
    alt: item.image.alt ?? '',
  }))

  return (
    <>
      <div
        className={cn('relative aspect-square group', hasStack && 'cursor-pointer', className)}
        onClick={hasStack ? () => setOpen(true) : undefined}
        role={hasStack ? 'button' : undefined}
        aria-label={hasStack ? `View all ${populated.length} photos` : undefined}
        tabIndex={hasStack ? 0 : undefined}
        onKeyDown={
          hasStack ? (e) => e.key === 'Enter' && setOpen(true) : undefined
        }
      >
        {/* Layer 0: back — 3+ images only; rests at rotate(0), fans to -4deg on hover */}
        {backImage && (
          <div className="absolute inset-0 rounded-xl overflow-hidden transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-[4deg] group-hover:-translate-y-1">
            <Media
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
              resource={backImage.image}
            />
          </div>
        )}

        {/* Layer 1: mid — 2+ images; rests at rotate(0), fans to +4deg on hover */}
        {midImage && (
          <div className="absolute inset-0 rounded-xl overflow-hidden transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] [transition-delay:40ms] group-hover:rotate-[4deg] group-hover:-translate-y-1">
            <Media
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
              resource={midImage.image}
            />
          </div>
        )}

        {/* Layer 2: front — always on top, no animation */}
        <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg">
          <Media
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
            resource={frontImage.image}
          />
        </div>

        {/* Photo count badge — fades out on hover */}
        {hasStack && (
          <div className="absolute bottom-2 right-2 z-10 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded transition-opacity duration-200 group-hover:opacity-0 pointer-events-none select-none">
            📷 {populated.length}
          </div>
        )}
      </div>

      {hasStack && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          plugins={[Thumbnails, Zoom]}
          render={{
            slide: ({ slide }) => {
              const s = slide as MediaSlide
              return (
                <div className="relative flex items-center justify-center w-full h-full">
                  <Media resource={s.resource} imgClassName="object-contain max-h-full" />
                </div>
              )
            },
          }}
        />
      )}
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: exits 0, no errors.

If you see `"yet-another-react-lightbox"` module errors, confirm the package was installed in Task 1.

- [ ] **Step 3: Commit**

```bash
git add src/blocks/FeaturedCardsBlock/ImageStack.tsx
git commit -m "feat: add ImageStack component with hover stack and YARL lightbox"
```

---

## Task 4: Wire `ImageStack` into `Component.tsx`

**Files:**
- Modify: `src/blocks/FeaturedCardsBlock/Component.tsx`

- [ ] **Step 1: Add the `ImageStack` import**

At the top of `Component.tsx`, after the existing `Media` import, add:

```ts
import { ImageStack } from './ImageStack'
```

The existing line to keep:
```ts
import { Media } from '@/components/Media'
```

(Keep this import — it is used elsewhere in the file or may be needed later. If the linter flags it as unused after this change, remove it.)

- [ ] **Step 2: Replace the `card.media` render block**

Find this block inside the card render:
```tsx
{card.media && (
  <div className="w-full sm:w-2/5 aspect-square shrink-0 rounded-xl overflow-hidden">
    <Media
      className="w-full h-full"
      imgClassName="w-full h-full object-cover"
      resource={card.media}
    />
  </div>
)}
```

Replace it with:
```tsx
{card.gallery && card.gallery.length > 0 && (
  <div className="w-full sm:w-2/5 shrink-0">
    <ImageStack images={card.gallery} />
  </div>
)}
```

Note: `rounded-xl overflow-hidden` and `aspect-square` are removed from the wrapper because `ImageStack` manages its own shape and rounding internally.

- [ ] **Step 3: Remove the unused `Media` import if flagged**

If TypeScript or the linter reports `Media` as unused, remove this line:
```ts
import { Media } from '@/components/Media'
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/blocks/FeaturedCardsBlock/Component.tsx
git commit -m "feat: wire ImageStack into FeaturedCardsBlock — replaces single media field"
```

---

## Task 5: Smoke Test in the Browser

**Goal:** Confirm the hover stack, photo count badge, and lightbox all work end-to-end.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Add gallery images to a card in the Payload admin**

Open `http://localhost:3000/admin`, navigate to a page that uses `FeaturedCardsBlock`, open a card, and upload 3+ images to the `Gallery Images` field. Save/publish.

- [ ] **Step 3: Check the card on the frontend**

Open the page. Verify:
- The first image is shown (no rotation, no hover effect until you hover)
- Hovering the image area fans out 2 backing images (−4deg / +4deg rotation + slight upward lift)
- The `📷 N` badge is visible at rest and fades on hover
- Clicking the image area opens the YARL lightbox in full-screen
- Arrow keys navigate between photos
- The thumbnail strip appears at the bottom
- Escape closes the lightbox

- [ ] **Step 4: Check the 1-image edge case**

Set a card's gallery to exactly 1 image. Verify:
- No hover effect
- No badge
- Clicking the image does NOT open a lightbox

- [ ] **Step 5: Check the 2-image edge case**

Set a card's gallery to exactly 2 images. Verify:
- One backing image fans out on hover (+4deg only)
- Lightbox opens on click with 2 slides and a thumbnail strip

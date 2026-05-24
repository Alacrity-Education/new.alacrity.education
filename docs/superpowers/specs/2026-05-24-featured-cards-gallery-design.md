# Featured Cards — Per-Card Gallery with Hover Stack & Lightbox

**Date:** 2026-05-24
**Status:** Approved

## Overview

Each card in the `FeaturedCardsBlock` gains a gallery of up to 7 images. The cover image is displayed as before. On hover, two backing images rotate out from underneath to create a tactile "stack of photos" effect. Clicking the stack opens a full-screen YARL carousel showing all images in the gallery.

---

## 1. Schema Changes

The existing `media` field (single `upload`) on each card is **replaced** by a `gallery` array field.

```
FeaturedCardsBlock.cards[].gallery
  type: array
  maxRows: 7
  fields:
    - name: image
      type: upload
      relationTo: media
      required: true
```

- `gallery[0]` is the cover image (front of stack, always shown).
- `gallery[1]` and `gallery[2]` are the backing images for the hover stack effect.
- `gallery[3..6]` appear only in the lightbox.
- After schema change: run `generate:types` to update `payload-types.ts`.

---

## 2. Hover Stack Effect

### Component: `ImageStack`

A new client component `src/blocks/FeaturedCardsBlock/ImageStack.tsx` receives the gallery images array and renders the stack.

**Layer structure** (all absolutely positioned, same bounding box as the image area):

| Layer | Content | Resting state | Hover state |
|-------|---------|---------------|-------------|
| 0 (back) | `gallery[1]` — only if `gallery.length >= 3` | `rotate(0)` (hidden behind front) | `rotate(-4deg) translateY(-4px)` |
| 1 (mid) | `gallery[2]` (or `gallery[1]` if length == 2) — only if `gallery.length >= 2` | `rotate(0)` (hidden behind front) | `rotate(4deg) translateY(-4px)` |
| 2 (front) | `gallery[0]` | no rotation | no change |

**CSS transitions:**
- `transform 0.35s cubic-bezier(.34, 1.56, .64, 1)` on layers 0 and 1 (spring-like overshoot)
- Layer 1 gets `transition-delay: 0.04s` for a subtle stagger
- A small `📷 N` badge (N = total gallery count) fades out on hover

**Hover conditions:**
- `gallery.length === 1`: no backing layers, no badge, no lightbox trigger
- `gallery.length === 2`: one backing layer (layer 1 only, `+4deg`), lightbox opens on click
- `gallery.length >= 3`: both backing layers, lightbox opens on click

**Click target:** The entire `ImageStack` div is the click target. Card text content and CTA links are unaffected.

---

## 3. Lightbox

**Library:** `yet-another-react-lightbox` (YARL)

**Plugins enabled:**
- `Thumbnails` — horizontal thumbnail strip at the bottom of the carousel
- `Zoom` — pinch / double-click zoom on mobile and desktop

**Configuration:**
- `slides` is built from the full `gallery` array: `gallery.map(item => ({ src: item.image.url }))` — requires the page/block query to use `depth >= 1` so gallery images are populated objects (not bare IDs)
- `index` is always `0` when opened (start from the first photo)
- `open` / `close` managed by `useState` inside `ImageStack`

YARL handles keyboard navigation (arrow keys, Escape), touch swipe, focus trap, and ARIA roles automatically.

---

## 4. Component Architecture

```
FeaturedCardsBlock/
├── Component.tsx          (existing — add ImageStack where <Media> was)
├── config.ts              (replace media field with gallery array)
└── ImageStack.tsx         (new — hover stack + YARL lightbox)
```

`ImageStack` is a `'use client'` component. `Component.tsx` is already `'use client'` so the import is straightforward.

**Props:**
```ts
interface ImageStackProps {
  images: Array<{ image: Media | number }>
  className?: string
}
```

---

## 5. Implementation Steps

1. Update `config.ts` — replace `media` field with `gallery` array (max 7)
2. Run `pnpm generate:types` to regenerate `payload-types.ts`
3. Install `yet-another-react-lightbox`
4. Create `ImageStack.tsx` with CSS hover stack + YARL integration
5. Update `Component.tsx` — replace `<Media resource={card.media}>` with `<ImageStack images={card.gallery}>`
6. Validate TypeScript with `tsc --noEmit`

---

## 6. Out of Scope

- No data migration for existing cards with the old `media` field (dev environment, no prod data)
- No reordering UI for gallery images inside the card (Payload's array field handles drag-to-reorder natively)
- No video support in the gallery

# GridBlock Layout Simplification Design

## Goal

Remove all span/colspan/rowspan complexity from the GridBlock. Replace with a simple fixed responsive grid that works for 4-cell or 8-cell stats layouts.

## Schema Changes

### Block-level fields

**Remove:** `columns` (number), `rows` (number)

**Add:** `rows` select — `'1'` (single row, 4 cells) or `'2'` (two rows, 8 cells). Informational for editors; does not affect CSS.

**Keep:** `variant` select (`'base'` | `'primary'`)

### Cell-level fields

**Remove:** `colSpan`, `rowSpan`, `colSpanMobile`, `rowSpanMobile`

**Keep:** `cellType` (`'text'` | `'textImage'` | `'link'`), `title`, `description`, `media`, `link`

## Component Layout

Grid class: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

| Breakpoint | Columns | Cells per row |
|------------|---------|---------------|
| default/sm | 1       | 1             |
| md         | 2       | 2             |
| lg+        | 4       | 4             |

With `rows: '1'` editors add 4 cells → 1 row at lg+.  
With `rows: '2'` editors add 8 cells → 2 rows at lg+.  
The CSS is identical — the grid auto-wraps.

## Cell Height

Content-driven. No fixed aspect ratio. Remove all CSS custom properties (`--aspect-mobile`, `--aspect-desktop`) and the `aspectRatioClass` constant.

## Description Text Size

Add `text-base lg:text-lg xl:text-xl` to description `<RichText>` className across all three cell types.

## Removed Code

- `mobileColClass`, `desktopColClass`, `mobileRowClass`, `desktopRowClass`, `desktopGridColsClass` maps
- `aspectRatioClass` constant
- `cellAspectStyle` CSS variable object
- `spanClasses` computation
- All `col-span-*`, `row-span-*`, `xl:col-span-*`, `xl:row-span-*`, `xl:grid-cols-*` Tailwind classes

## Files Changed

- `src/blocks/GridBlock/config.ts` — schema simplification
- `src/blocks/GridBlock/Component.tsx` — layout simplification
- `src/payload-types.ts` — regenerated after schema change

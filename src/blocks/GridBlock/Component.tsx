import React from 'react'
import Link from 'next/link'

import type { GridBlock as GridBlockProps } from '@/payload-types'
import type { Page, Post } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const containerBg: Record<string, string> = {
  base: 'bg-base-100 border-2 border-base-300',
  primary: 'bg-linear-to-b from-primary to-neutral via-primary',
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

/**
 * Overlay tints. `dark` is carried over verbatim from the old Text + Image
 * cell so the treatment is unchanged.
 *
 * `primary` is the same gradient in brand violet, but at HIGHER alphas — not
 * the same numbers. #3F3170 is a mid-dark violet, not black, so matching the
 * nominal alpha would leave it visibly weaker: over a white image primary/50
 * measures 2.74:1 against white text where black/50 measures 3.98:1. /26 and
 * /65 are the alphas that reproduce the dark option's contrast, which makes
 * switching a true hue swap rather than a legibility change.
 *
 * Caveat on both: the stops are 20%-50%-20%, darkest in the MIDDLE, while the
 * text sits at the top (text cells) or bottom (link cells). Against a bright
 * photo those edges measure ~1.6:1 — below the 4.5:1 body text needs. See the
 * note in the PR/handover for the stronger stops that fix it.
 */
const cellOverlay: Record<string, string> = {
  dark: 'bg-linear-to-t from-black/20 via-black/30 to-black/20',
  primary: 'bg-linear-to-t from-primary/26 via-primary/65 to-primary/26',
}

/** Text drawn over an image is always white, whichever container variant. */
const mediaTitleClass = 'text-primary-content'
const mediaProseClass = 'text-base lg:text-lg xl:text-xl [&_p]:text-primary-content'

type CellMedia = NonNullable<GridBlockProps['cells']>[number]['media']

/**
 * Image plus tint, filling the cell behind its content. Absolutely positioned,
 * so the caller needs `relative overflow-hidden` and content at `z-10`.
 */
const CellBackground: React.FC<{ media: CellMedia; overlay?: string | null }> = ({
  media,
  overlay,
}) => (
  <>
    <Media
      className="absolute inset-0 w-full h-full brightness-90"
      imgClassName="w-full h-full object-cover"
      resource={media}
    />
    <div className={cn('absolute inset-0', cellOverlay[overlay ?? 'dark'] ?? cellOverlay.dark)} />
  </>
)

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
          'grid grid-cols-1 sm:grid-cols-2 shadow-2xl  lg:grid-cols-4 gap-3 sm:gap-8 rounded-box p-3 sm:p-8',
          containerBg[v],
        )}
      >
        {(cells ?? []).map((cell, i) => {
          // ── Text cell ────────────────────────────────────────────────────
          if (cell.cellType === 'text') {
            return (
              <div
                key={cell.id ?? i}
                className={cn(
                  'relative flex flex-col rounded-box aspect-2/1 sm:aspect-square p-10 sm:p-4  md:p-6 lg:p-4 xl:p-6',
                  // Plain cells keep the mobile hairline divider between stacked
                  // rows; an image cell is a self-contained tile instead, fully
                  // rounded like the link cells, so neither applies to it.
                  cell.media
                    ? 'overflow-hidden'
                    : 'border-b rounded-b-none border-base-100/20 sm:border-none',
                )}
              >
                {cell.media && <CellBackground media={cell.media} overlay={cell.overlay} />}
                <div className="relative z-10 flex flex-col">
                  {cell.title && (
                    <p
                      className={cn(
                        'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-2',
                        cell.media ? mediaTitleClass : titleClass[v],
                      )}
                    >
                      {cell.title}
                    </p>
                  )}
                  {cell.description && (
                    <RichText
                      className={cn(
                        'mb-0 w-full max-w-full mx-0',
                        cell.media ? mediaProseClass : descriptionProseClass[v],
                        noProseMargins,
                      )}
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
                key={cell.id ?? i}
                href={href}
                {...newTabProps}
                className={cn(
                  'group relative flex flex-col rounded-box p-4 sm:p-6 transition-colors aspect-2/1 sm:aspect-square',
                  // The colour on the wrapper also carries the ↗ glyph, which
                  // inherits currentColor rather than a class of its own.
                  cell.media ? 'overflow-hidden text-primary-content' : linkCellBg[v],
                )}
              >
                {cell.media && <CellBackground media={cell.media} overlay={cell.overlay} />}
                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="flex justify-end">
                    <span className="text-5xl font-semibold leading-none transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </div>
                  <div className="flex-1" />
                  {cell.title && (
                    <p
                      className={cn(
                        'text-2xl font-semibold mb-2',
                        cell.media ? mediaTitleClass : linkCellTitleClass[v],
                      )}
                    >
                      {cell.title}
                    </p>
                  )}
                  {cell.description && (
                    <RichText
                      className={cn(
                        'mb-0 w-full mx-0',
                        cell.media ? mediaProseClass : linkCellProseClass[v],
                        noProseMargins,
                      )}
                      data={cell.description}
                      enableGutter={false}
                      enableProse={false}
                    />
                  )}
                </div>
              </Link>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

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
          'grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-3 sm:gap-8 rounded-2xl p-3 sm:p-8',
          containerBg[v],
        )}
      >
        {(cells ?? []).map((cell, i) => {
          // ── Text cell ────────────────────────────────────────────────────
          if (cell.cellType === 'text') {
            return (
              <div key={cell.id ?? i} className="flex flex-col rounded-xl aspect-2/1 sm:aspect-square p-10 sm:p-4  md:p-6 lg:p-4 xl:p-6 border-b rounded-b-none border-base-100/20 sm:border-none">
                {cell.title && (
                  <p className={cn('text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2', titleClass[v])}>
                    {cell.title}
                  </p>
                )}
                {cell.description && (
                  <RichText
                    className={cn('mb-0 w-full max-w-full mx-0', descriptionProseClass[v], noProseMargins)}
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
              <div
                key={cell.id ?? i}
                className="relative rounded-xl overflow-hidden aspect-2/1 sm:aspect-square min-h-48 sm:min-h-64"
              >
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
                    <p className="ttext-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 text-primary-content">
                      {cell.title}
                    </p>
                  )}
                  {cell.description && (
                    <RichText
                      className={cn(
                        'mb-0 w-full mx-0 text-lg lg:text-xl xl:text-xl [&_p]:text-primary-content',
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
                  'group flex flex-col rounded-xl p-4 sm:p-6 transition-colors aspect-2/1 sm:aspect-square',
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

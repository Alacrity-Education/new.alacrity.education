import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'
import { LinkAppearanceVariants } from '@/fields/link'

export type CMSLinkType = {
  appearance?: 'inline' | "inlinePrimary" | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

/**
 * Resolves a Payload link group (reference or custom URL) to an href.
 * Exported so nav primitives that need a bare <a> (e.g. Radix NavigationMenuLink
 * with `asChild`) can build their own anchor instead of rendering a CMSLink.
 */
export const resolveLinkHref = ({
  type,
  reference,
  url,
}: Pick<CMSLinkType, 'type' | 'reference' | 'url'>): string | null | undefined =>
  type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
    ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${reference.value.slug}`
    : url

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href = resolveLinkHref({ type, reference, url })

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline' || appearance === 'inlinePrimary' ) {
    return (
      <Link
        className={cn(LinkAppearanceVariants[appearance], className)}
        href={href || url || ''}
        {...newTabProps}
      >
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}

'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type NavItem = NonNullable<Header['navItems']>[number]
type NavColumn = NonNullable<NavItem['columns']>[number]
type NavColumnLink = NonNullable<NavColumn['links']>[number]

export const RowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NavItem>()

  const index = rowNumber !== undefined ? rowNumber + 1 : ''
  const title = data?.itemType === 'parent' ? data?.label : data?.link?.label
  const suffix = data?.itemType === 'parent' ? ' (dropdown)' : ''

  return <div>{title ? `Nav item ${index}: ${title}${suffix}` : 'Row'}</div>
}

export const ColumnRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NavColumn>()

  const index = rowNumber !== undefined ? rowNumber + 1 : ''
  const count = data?.links?.length ?? 0

  return <div>{data?.heading || `Column ${index}`} — {count} link{count === 1 ? '' : 's'}</div>
}

/** Items have no label field any more — pull the first line out of the rich text. */
const firstTextIn = (node: any): string | undefined => {
  if (!node) return undefined
  if (typeof node.text === 'string' && node.text.trim()) return node.text.trim()
  for (const child of node.children || []) {
    const found = firstTextIn(child)
    if (found) return found
  }
  return undefined
}

export const SubItemRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NavColumnLink>()

  const title = firstTextIn((data?.content as any)?.root)

  return <div>{title || `Link ${rowNumber !== undefined ? rowNumber + 1 : ''}`}</div>
}

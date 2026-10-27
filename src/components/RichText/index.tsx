import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  SerializedUploadNode,
  type DefaultTypedEditorState,
  type SerializedTableCellNode,
  type SerializedTableNode,
  type SerializedTableRowNode,
} from '@payloadcms/richtext-lexical'
import {
  type JSXConverterArgs,
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
  MapBlock as MapBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { MapBlockInline } from '@/blocks/Map/MapBlockInline'
import { cn } from '@/utilities/ui'
import { customConverters } from '@/components/RichText/CustomConverter'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Media } from '@/payload-types'
import { textColorClasses, type TextColor } from '@/fields/textColors'

// DefaultNodeTypes does not cover the table nodes: the feature is still
// experimental upstream, so its nodes are not in the default union and have to
// be added by hand.
type NodeTypes =
  | DefaultNodeTypes
  | SerializedTableNode
  | SerializedTableRowNode
  | SerializedTableCellNode
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps | MapBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

/**
 * Payload's default upload converter emits `src`/`srcSet` straight from the
 * API, which are relative to the Payload instance. When that instance is
 * remote those paths have to be resolved against its origin, so this override
 * mirrors the default markup with corrected URLs.
 */
const uploadConverter = ({ node }: { node: SerializedUploadNode }) => {
  if (typeof node.value !== 'object' || node.value === null) return null

  const doc = node.value as Media
  const alt = (node.fields as { alt?: string } | undefined)?.alt || doc.alt || ''
  const url = getMediaUrl(doc.url, doc.updatedAt)

  if (!doc.mimeType?.startsWith('image')) {
    return (
      <a href={url} rel="noopener noreferrer">
        {doc.filename}
      </a>
    )
  }

  const sources = Object.entries(doc.sizes ?? {}).flatMap(([key, size]) =>
    size?.width && size?.height && size?.mimeType && size?.filesize && size?.filename && size?.url
      ? [
          <source
            key={key}
            media={`(max-width: ${size.width}px)`}
            srcSet={getMediaUrl(size.url, doc.updatedAt)}
            type={size.mimeType}
          />,
        ]
      : [],
  )

  const img = (
    <img
      key="image"
      alt={alt}
      height={doc.height ?? undefined}
      src={url}
      width={doc.width ?? undefined}
    />
  )

  return sources.length ? (
    <picture>
      {sources}
      {img}
    </picture>
  ) : (
    img
  )
}

/**
 * Replaces Payload's own table converters.
 *
 * Theirs hard-code `border: 1px solid #ccc` and `padding: 8px` as inline
 * styles on every cell, and an inline style beats any stylesheet — so the
 * table rules this site already carries could never apply and tables would
 * arrive in a grey that is nowhere else in the palette.
 *
 * These emit plain markup instead, so a table is styled by the typography
 * plugin and .prose-alacrity exactly like one written in Markdown would be.
 * --tw-prose-th-borders and --tw-prose-td-borders are already pointed at the
 * house colours further up globals.css.
 *
 * The only addition is the scroll wrapper: a table of any width has to fit a
 * phone somehow, and swiping it beats wrapping every cell to three lines.
 */
const tableConverters = {
  table: ({ node, nodesToJSX }: JSXConverterArgs<SerializedTableNode>) => {
    // A first row of nothing but header cells becomes a real <thead>. Payload
    // puts every row in <tbody>, and the typography plugin pads `thead th` and
    // `tbody td` but not a `th` inside tbody — so the header text sat half a
    // character left of the column under it. It is also what a screen reader
    // needs to announce the column a cell belongs to.
    const [first, ...rest] = node.children
    const firstRow = first?.type === 'tablerow' ? (first as SerializedTableRowNode) : undefined
    const headerCells = (firstRow?.children ?? []) as SerializedTableCellNode[]
    const firstIsHeader =
      headerCells.length > 0 && headerCells.every((cell) => cell.headerState > 0)

    return (
      <div className="w-full overflow-x-auto">
        <table>
          {firstIsHeader && <thead>{nodesToJSX({ nodes: [first] })}</thead>}
          <tbody>{nodesToJSX({ nodes: firstIsHeader ? rest : node.children })}</tbody>
        </table>
      </div>
    )
  },

  tablerow: ({ node, nodesToJSX }: JSXConverterArgs<SerializedTableRowNode>) => (
    <tr>{nodesToJSX({ nodes: node.children })}</tr>
  ),

  tablecell: ({ node, nodesToJSX }: JSXConverterArgs<SerializedTableCellNode>) => {
    // headerState is a bitmask: 1 is a header row, 2 a header column, 3 both.
    const Cell = node.headerState > 0 ? 'th' : 'td'

    return (
      <Cell
        colSpan={node.colSpan && node.colSpan > 1 ? node.colSpan : undefined}
        rowSpan={node.rowSpan && node.rowSpan > 1 ? node.rowSpan : undefined}
        style={node.backgroundColor ? { backgroundColor: node.backgroundColor } : undefined}
      >
        {nodesToJSX({ nodes: node.children })}
      </Cell>
    )
  },
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...tableConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  upload: uploadConverter,

  /**
   * Paints the colour an editor picked with TextStateFeature. Inert for every
   * editor that does not have the feature, since nothing sets `$.color` there.
   *
   * It delegates before it wraps: the default converter is what turns the
   * format bitmask into <strong>, <em>, <code> and the rest, so replacing it
   * outright would silently drop every one of them.
   */
  text: (args) => {
    const renderDefault = defaultConverters.text as
      | ((a: typeof args) => React.ReactNode)
      | undefined
    const rendered = renderDefault?.(args) ?? args.node.text

    const color = (args.node as { $?: { color?: string } }).$?.color
    const className = color ? textColorClasses[color as TextColor] : undefined
    if (!className) return rendered

    return <span className={className}>{rendered}</span>
  },

  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    mapBlock: ({ node }) => <MapBlockInline {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  converter?: JSXConvertersFunction<NodeTypes>
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, converter, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={converter || jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose prose-alacrity': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}

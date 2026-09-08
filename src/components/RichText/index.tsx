import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  SerializedUploadNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
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

type NodeTypes =
  | DefaultNodeTypes
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

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  upload: uploadConverter,
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

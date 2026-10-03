import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
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
import { textColorClasses, type TextColor } from '@/fields/textColors'

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

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),

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

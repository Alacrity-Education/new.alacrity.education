import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Showcase } from '@/payload-types'
import { Card, CardBody, CardCTA, CardImage } from '@/components/primitives/card'
import { CardBlock } from '@/blocks/CardBlock/Component'

interface ShowcaseContentProps {
  heading?: string | null
}

export default async function ShowcaseContent({
  heading = 'Perks. Only some of them.',
}: ShowcaseContentProps) {
  const payload = await getPayload({ config })

  const { docs: _showcase } = await payload.find({
    collection: 'showcase',
    limit: 100,
    depth: 2,
    sort: 'order',
  })

  return (
    <CardBlock
      type="perks"
      heading={heading}
      className="bg-base-100 z-20 flex flex-col items-center py-10 pb-20"
    />
  )
}

interface ShowcaseCardProps {
  showcase: Showcase
}

const _ShowcaseCard = ({ showcase }: ShowcaseCardProps) => {
  let imageUrl: React.ReactNode = null

  if (showcase.image) {
    if (typeof showcase.image === 'object' && showcase.image.url) {
      imageUrl = (
        <Image
          src={showcase.image.url}
          alt={typeof showcase.title === 'string' ? showcase.title : 'Showcase image'}
          width={500}
          height={500}
          className="h-full w-full object-contain"
        />
      )
    }
  }

  return (
    <Card>
      <CardImage className="bg-primary">
        <div className="invert h-full w-full">{imageUrl}</div>
      </CardImage>
      <CardBody className="h-full w-full">
        <div className="relative w-full h-full flex flex-col">
          <h3 className="text-3xl font-semibold">
            {typeof showcase.title === 'string' ? showcase.title : ''}
          </h3>
          <p className="text-base text-base-content pt-2 leading-snug">{showcase.description}</p>
          <div className="flex-1"></div>
          {showcase.linkUrl && (
            <CardCTA href={showcase.linkUrl}>{showcase.linkText || 'Learn More'}</CardCTA>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

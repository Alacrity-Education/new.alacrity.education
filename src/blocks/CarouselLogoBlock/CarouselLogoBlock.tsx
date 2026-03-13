import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Carousel, { CarouselCard } from './primitives/carousel'

export interface CarouselLogoItem {
  href: string
  src: string
  alt: string
}

interface CarouselLogoBlockProps {
  type: 'partners' | 'sponsors'
  title?: string
}

export const CarouselLogoBlock: React.FC<CarouselLogoBlockProps> = async ({ type, title = '' }) => {
  const payload = await getPayload({ config })

  const collection = type === 'partners' ? 'partners' : 'sponsors'

  const { docs } = await payload.find({
    collection,
    depth: 1, // to populate media
  })

  const items: CarouselLogoItem[] = docs.map((doc: any) => ({
    href: doc.websiteUrl,
    src: doc.image?.url || '',
    alt: doc.name,
  }))

  return (
    <Carousel title={title} items={items}>
      {items.map((item, index) => (
        <CarouselCard key={`${index}-${item.alt}`} href={item.href} alt={item.alt} src={item.src} />
      ))}
    </Carousel>
  )
}

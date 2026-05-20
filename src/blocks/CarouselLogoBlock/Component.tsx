import React from 'react'
import Carousel, { CarouselCard } from './primitives/carousel'
import { LogoCarousel } from '@/payload-types'
import { SectionTitle } from '@/components/SectionTitle'

export const CarouselLogoBlock: React.FC<LogoCarousel> = async ({ title, items }) => {
  return (
    <div>
    <div className="container">
      <SectionTitle className={"text-center"} title={title} />
    </div>
      <Carousel>
        {items?.map((item, index) => (
          item.media && <CarouselCard key={index} link={item.link || ''} media={item.media} />
        ))}
      </Carousel>
    </div>
  )
}

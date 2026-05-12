import React from 'react'
import Carousel, { CarouselCard } from './primitives/carousel'
import { LogoCarousel } from '@/payload-types'


export const CarouselLogoBlock: React.FC<LogoCarousel> = async ({ blockTitle = '', items }) => {

  return (
    <Carousel title={blockTitle || ""}>
      {items?.map((item, index) => (
        (item.media && <CarouselCard key={ index } link={item.link || ""} media={item.media} />)
      ))}
    </Carousel>
  )
}

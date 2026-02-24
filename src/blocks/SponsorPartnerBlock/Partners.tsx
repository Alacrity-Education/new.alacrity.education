import { getPayload } from 'payload'
import config from '@payload-config'
import { Partner, Media } from '@/payload-types' // Import Media for casting
import Carousel, { CarouselCard } from './primitives/carousel'

interface PartnersProps {
  title?: string
}

export default async function Partners({ title = 'Partners' }: PartnersProps) {
  const payload = await getPayload({ config })

  const { docs: partners } = await payload.find({
    collection: 'partners',
    limit: 100,
    depth: 2,
  })

  const partnerItems = partners.map((partner: Partner) => {
    // 1. Determine the image source safely
    let imageSrc = ''

    if (partner.image && typeof partner.image === 'object') {
      // Cast to Media to access the .url property safely
      imageSrc = (partner.image as Media).url || ''
    } else if (typeof partner.image === 'string') {
      imageSrc = partner.image
    }

    return {
      // 2. Add fallbacks for href and alt to avoid 'undefined' errors
      href: partner.websiteUrl || '#',
      src: imageSrc,
      alt: partner.name || 'Partner logo',
    }
  })

  // 3. Optional: Filter out partners that don't have a valid image URL
  const validPartners = partnerItems.filter((item) => item.src !== '')

  return (
    <Carousel title={title} items={validPartners}>
      {validPartners.map((item, index) => (
        <CarouselCard key={`${index}-${item.alt}`} href={item.href} alt={item.alt} src={item.src} />
      ))}
    </Carousel>
  )
}

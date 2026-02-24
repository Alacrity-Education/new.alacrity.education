import { getPayload } from 'payload'
import config from '@payload-config'
import { Sponsor, Media } from '@/payload-types' // Import Media type too
import Carousel, { CarouselCard } from './primitives/carousel'

interface SponsorsProps {
  title?: string
}

export default async function Sponsors({ title = 'Sponsors' }: SponsorsProps) {
  const payload = await getPayload({ config })

  const { docs: sponsors } = await payload.find({
    collection: 'sponsors',
    limit: 100,
    depth: 2,
  })

  const sponsorItems = sponsors.map((sponsor: Sponsor) => {
    // Determine the image source safely
    let imageSrc = ''

    if (sponsor.image && typeof sponsor.image === 'object') {
      imageSrc = (sponsor.image as Media).url || ''
    } else if (typeof sponsor.image === 'string') {
      imageSrc = sponsor.image
    }

    return {
      href: sponsor.websiteUrl || '#',
      src: imageSrc,
      alt: sponsor.name || 'Sponsor Logo',
    }
  })

  // Optional: Filter out items that have no image source to avoid broken layouts
  const validSponsors = sponsorItems.filter((item) => item.src !== '')

  return (
    <Carousel title={title} items={validSponsors}>
      {validSponsors.map((item, index) => (
        <CarouselCard key={`${index}-${item.alt}`} href={item.href} alt={item.alt} src={item.src} />
      ))}
    </Carousel>
  )
}

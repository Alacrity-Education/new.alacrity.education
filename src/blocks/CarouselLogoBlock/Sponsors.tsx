import { getPayload } from 'payload'
import config from '@payload-config'
import { Sponsor, Media } from '@/payload-types'
import { CarouselLogoBlock, CarouselLogoItem } from './CarouselLogoBlock'

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

  const _sponsorItems: CarouselLogoItem[] = sponsors.map((sponsor: Sponsor) => {
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

  return <CarouselLogoBlock type="sponsors" title={title} />
}

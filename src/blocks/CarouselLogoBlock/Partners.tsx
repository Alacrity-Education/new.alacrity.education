import { getPayload } from 'payload'
import config from '@payload-config'
import { Partner, Media } from '@/payload-types'
import { CarouselLogoBlock, CarouselLogoItem } from './CarouselLogoBlock'

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

  const _partnerItems: CarouselLogoItem[] = partners.map((partner: Partner) => {
    let imageSrc = ''

    if (partner.image && typeof partner.image === 'object') {
      imageSrc = (partner.image as Media).url || ''
    } else if (typeof partner.image === 'string') {
      imageSrc = partner.image
    }

    return {
      href: partner.websiteUrl || '#',
      src: imageSrc,
      alt: partner.name || 'Partner logo',
    }
  })

  return <CarouselLogoBlock type="partners" title={title} />
}

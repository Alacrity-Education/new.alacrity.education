import React from 'react'
import type { SponsorPartnerBlock as SponsorPartnerBlockProps } from '@/payload-types'
import Sponsors from './Sponsors'
import Partners from './Partners'

type Props = {
  className?: string
} & SponsorPartnerBlockProps

export const SponsorPartnerBlock: React.FC<Props> = ({ className, sponsorText, partnerText }) => {
  return (
    <div className={className}>
      <Sponsors title={sponsorText || undefined} />
      <Partners title={partnerText || undefined} />
    </div>
  )
}

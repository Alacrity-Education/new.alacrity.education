import React from 'react'
import { Map } from '@/components/Map'
import { ContactInfoCard } from '@/components/ContactInfoCard'
import type { MapBlock } from '@/payload-types'

export const MapBlockComponent: React.FC<MapBlock> = ({
  latitude,
  longitude,
  zoom,
  markerLabel,
  markerSubtitle,
  openInMapsUrl,
  showContactCard,
  contactCard,
}) => {
  const hasCard = showContactCard && contactCard

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-sm border border-base-200">
      <div className="w-full aspect-[16/9] relative">
        <Map
          latitude={latitude}
          longitude={longitude}
          zoom={zoom ?? 14}
          markerLabel={markerLabel ?? undefined}
          markerSubtitle={markerSubtitle ?? undefined}
          openInMapsUrl={openInMapsUrl ?? undefined}
          className="absolute inset-0"
        />
      </div>

      {hasCard && (
        <ContactInfoCard
          heading={contactCard.heading}
          phone={contactCard.phone}
          phoneLabel={contactCard.phoneLabel}
          email={contactCard.email}
        />
      )}
    </div>
  )
}

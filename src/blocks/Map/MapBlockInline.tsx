'use client'

import React from 'react'
import { MapClient } from '@/components/Map/MapClient'
import { ContactInfoCard } from '@/components/ContactInfoCard'
import type { MapBlock } from '@/payload-types'

export function MapBlockInline({
  latitude,
  longitude,
  zoom,
  markerLabel,
  markerSubtitle,
  openInMapsUrl,
  showContactCard,
  contactCard,
}: MapBlock) {
  const hasCard = showContactCard && contactCard

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-sm border border-base-200 my-4">
      <div className="w-full aspect-[16/9] relative">
        <MapClient
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

'use client'

import * as React from 'react'
import { MapClient } from '@/components/Map/MapClient'

interface ContactMapProps {
  latitude?: number
  longitude?: number
}

export default function ContactMap({
  latitude = 44.446075,
  longitude = 26.094224,
}: ContactMapProps) {
  return (
    <MapClient
      latitude={latitude}
      longitude={longitude}
      markerLabel="Alacrity Headquarters"
      markerSubtitle="Str. Christian Tell nr. 22"
      className="min-h-[300px]"
    />
  )
}

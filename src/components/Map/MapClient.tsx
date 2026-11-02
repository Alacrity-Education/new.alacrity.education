'use client'

import * as React from 'react'
import Map, { Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import Link from 'next/link'
import { FaArrowUp, FaLocationDot } from 'react-icons/fa6'

// CARTO Positron. The privacy policy (clause 4.3) names CARTO as the map
// provider, so changing this URL means updating that page too. CARTO's terms
// require our own key; the style passes it on to every tile, sprite and font
// request. It is public by design (it ships in the browser bundle).
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY
const MAP_STYLE_URL = `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json${
  CARTO_KEY ? `?key=${encodeURIComponent(CARTO_KEY)}` : ''
}`

export interface MapClientProps {
  latitude: number
  longitude: number
  zoom?: number
  markerLabel?: string
  markerSubtitle?: string
  openInMapsUrl?: string
  showPopup?: boolean
  className?: string
  interactive?: boolean
}

export function MapClient({
  latitude,
  longitude,
  zoom = 14,
  markerLabel,
  markerSubtitle,
  openInMapsUrl,
  showPopup = true,
  className,
  interactive = true,
}: MapClientProps) {
  const mapsUrl =
    openInMapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`

  return (
    <div
      className={[
        'w-full h-full relative',
        '[&_.maplibregl-popup-tip]:!border-b-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Map
        initialViewState={{ latitude, longitude, zoom }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE_URL}
        interactive={interactive}
        dragRotate={false}
        touchPitch={false}
      >
        <Marker latitude={latitude} longitude={longitude} anchor="bottom">
          <FaLocationDot className="text-primary h-8 w-8 drop-shadow-lg" />
        </Marker>

        {showPopup && (
          <Popup
            latitude={latitude}
            longitude={longitude}
            closeButton={false}
            closeOnClick={false}
            closeOnMove={false}
            anchor="top"
            focusAfterOpen={false}
            offset={[0, 10]}
          >
            <div className="p-2 min-w-[160px]">
              {markerLabel && (
                <div className="text-sm font-bold text-center text-base-content">{markerLabel}</div>
              )}
              {markerSubtitle && (
                <div className="text-xs text-center text-base-content/70 mb-2">
                  {markerSubtitle}
                </div>
              )}
              <Link
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-xs w-full flex gap-1 items-center justify-center"
              >
                Open in Maps <FaArrowUp className="h-2 w-2 rotate-45" />
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}

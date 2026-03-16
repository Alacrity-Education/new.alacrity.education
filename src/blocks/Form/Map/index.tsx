'use client'

import * as React from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import Link from 'next/link'
import { FaArrowUp, FaLocationDot } from 'react-icons/fa6'

interface ContactMapProps {
  latitude?: number
  longitude?: number
}

const DEFAULT_LOCATION = {
  longitude: 26.094224,
  latitude: 44.446075,
  zoom: 14,
}

export default function ContactMap({
  latitude = DEFAULT_LOCATION.latitude,
  longitude = DEFAULT_LOCATION.longitude,
}: ContactMapProps) {
  const LOCATION = {
    longitude,
    latitude,
    zoom: DEFAULT_LOCATION.zoom,
  }
  return (
    <div
      className={`w-full h-full min-h-[300px] relative
      [&_.mapboxgl-popup-tip]:!border-b-primary
      `}
    >
      <Map
        mapboxAccessToken="pk.eyJ1IjoibHVjYXNhaW5lbmNvIiwiYSI6ImNsM2V2YXJ2czA0bDYzam4wMXYycDU0eG0ifQ.p7mkAeKWRHsi3q6pLdMhIQ"
        initialViewState={{
          latitude: LOCATION.latitude,
          longitude: LOCATION.longitude,
          zoom: LOCATION.zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/lucasainenco/clo9pjg5000rp01qxh60taxwj"
      >
        <Marker {...LOCATION} anchor="bottom">
          <FaLocationDot className="text-primary h-8 w-8 drop-shadow-lg" />

          <Popup
            closeButton={false}
            closeOnClick={false}
            closeOnMove={false}
            anchor="top"
            focusAfterOpen={false}
            offset={[0, 10]}
            className=""
            {...LOCATION}
          >
            <div className="p-2 min-w-[160px]">
              <div className="text-sm font-bold text-center text-primary-content">
                Alacrity Headquarters
              </div>
              <div className="text-xs text-center opacity-75 mb-2 text-primary-content">
                Str. Christian Tell nr. 22
              </div>

              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${LOCATION.latitude},${LOCATION.longitude}`}
                target="_blank"
                className="btn btn-primary btn-xs w-full text-white flex gap-1 items-center justify-center"
              >
                Open in Maps <FaArrowUp className="h-2 w-2 rotate-45" />
              </Link>
            </div>
          </Popup>
        </Marker>
      </Map>
    </div>
  )
}

'use client'

import React from 'react'

type Props = {
  url: string
  opacity?: number // 0–100
}

export const PageBackground: React.FC<Props> = ({ url, opacity = 10 }) => {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none -z-10"
      style={{
        backgroundImage: `url(${url})`,
        backgroundRepeat: 'repeat',
        opacity: opacity / 100,
      }}
    />
  )
}

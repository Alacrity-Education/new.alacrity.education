import React from 'react'
import type { GalleryBlock as GalleryBlockProps } from '@/payload-types'
import GalleryContent from './gallery'

export const GalleryBlock: React.FC<GalleryBlockProps> = ({
  heading,
  headingHighlight,
  subtitle,
}) => {
  return (
    <GalleryContent heading={heading} headingHighlight={headingHighlight} subtitle={subtitle} />
  )
}

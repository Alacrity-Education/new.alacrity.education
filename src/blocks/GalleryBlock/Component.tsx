import React from 'react'
import type { GalleryBlock as GalleryBlockProps } from '@/payload-types'
import GalleryContent from './gallery'

export const GalleryBlock: React.FC<GalleryBlockProps> = ({ title, images }) => (
  <GalleryContent title={title} images={images} />
)

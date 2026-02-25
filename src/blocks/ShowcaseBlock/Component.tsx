import React from 'react'
import type { ShowcaseBlock as ShowcaseBlockProps } from '@/payload-types'
import ShowcaseContent from './showcase'

export const ShowcaseBlock: React.FC<ShowcaseBlockProps> = ({ heading }) => {
  return <ShowcaseContent heading={heading} />
}

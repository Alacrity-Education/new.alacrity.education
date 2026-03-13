import React from 'react'
import type { Team as TeamBlockProps } from '@/payload-types'
import TeamContent from './team'

export const TeamBlock: React.FC<TeamBlockProps> = ({ blockTitle }) => {
  return <TeamContent blockTitle={blockTitle} />
}

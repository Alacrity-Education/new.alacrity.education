import React from 'react'
import type { ProjectBlock as ProjectBlockProps } from '@/payload-types'
import ProjectContent from './projects'

export const ProjectBlock: React.FC<ProjectBlockProps> = ({ heading }) => {
  return <ProjectContent heading={heading} />
}

import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Project } from '@/payload-types'
import {
  Card as ProjectCard,
  CardImage as ProjectCardImage,
  CardBody as ProjectCardBody,
  CardCTA,
} from '@/components/primitives/card'
import { CardBlock } from '@/blocks/CardBlock/Component'

interface ProjectContentProps {
  heading?: string | null
}

export default async function ProjectContent({
  heading = 'Alacrity Projects.',
}: ProjectContentProps) {
  const payload = await getPayload({ config })

  const { docs: _projects } = await payload.find({
    collection: 'projects',
    limit: 100,
    depth: 2,
  })

  return <CardBlock type="projects" heading={heading} />
}

interface ProjectCardItemProps {
  project: Project
}

function _ProjectCardItem({ project }: ProjectCardItemProps) {
  let imageUrl = '/Falcon.svg'

  if (project.image) {
    if (typeof project.image === 'object' && project.image.url) {
      imageUrl = project.image.url
    }
  }

  return (
    <ProjectCard>
      <ProjectCardImage>
        <div className="w-full !h-34 relative bg-primary text-primary-content">
          <Image
            src={imageUrl}
            alt={typeof project.name === 'string' ? project.name : 'Project Image'}
            width={1000}
            height={1000}
            className="object-cover h-full w-full object-center rounded-lg absolute -right-1/3 top-0"
          />
          {project.cardText && (
            <div className="text-4xl h-34 relative font-bold z-10 p-4 px-6 h-full flex items-center bg-gradient-to-r from-black/50 to-black/20 whitespace-pre-line">
              {project.cardText}
            </div>
          )}
        </div>
      </ProjectCardImage>
      <ProjectCardBody>
        <div className="relative w-full h-full flex flex-col">
          <h3 className="text-3xl font-semibold">
            {typeof project.name === 'string' ? project.name : ''}
          </h3>
          <p className="text-base text-base-content pt-2 leading-snug">{project.description}</p>
          <div className="flex-1"></div>
          {project.url && <CardCTA href={project.url}>{project.link || 'Read More'}</CardCTA>}
        </div>
      </ProjectCardBody>
    </ProjectCard>
  )
}

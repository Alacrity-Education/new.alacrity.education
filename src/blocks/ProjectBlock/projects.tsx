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

interface ProjectContentProps {
  heading?: string | null
}

export default async function ProjectContent({
  heading = 'Alacrity Projects.',
}: ProjectContentProps) {
  const payload = await getPayload({ config })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    limit: 100,
    depth: 2,
  })

  return (
    <div className="w-screen min-h-max bg-gradient-to-b from-base-300 to-base-100 dark:via-base-300 px-4 pb-10 lg:px-20 h-max">
      <h2 className="text-2xl sm:text-5xl font-semibold py-16 text-center">{heading}</h2>
      <div className="flex flex-col md:flex-row items-center md:justify-center gap-6">
        {projects.map((project) => (
          <ProjectCardItem key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

interface ProjectCardItemProps {
  project: Project
}

function ProjectCardItem({ project }: ProjectCardItemProps) {
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

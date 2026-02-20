import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Member } from '@/payload-types'
//import { getMediaUrl } from '@/utilities/getMediaUrl'

export default async function TeamComponent() {
  const payload = await getPayload({ config })

  const { docs: members } = await payload.find({
    collection: 'members',
    limit: 100,
    depth: 2,
  })

  return (
    <div className="z-20 h-max bg-base-100 flex flex-col items-center py-10 ">
      <div className="text-2xl md:text-4xl lg:text-5xl font-semibold py-10">
        Meet the team behind <span className="text-primary">Alacrity</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 grid-rows-2">
        {members.map((member) => (
          <TeamMember key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}

const TeamMember = ({ member }: { member: Member }) => {
  let imageUrl = '/Falcon.svg'

  if (member.image) {
    if (typeof member.image === 'object' && member.image.url) {
      imageUrl = member.image.url
    }
  }

  return (
    <div className="h-64 w-40 md:h-64 md:w-64 p-4 flex flex-col gap-2 items-center justify-center">
      <div className="avatar relative">
        <div className="w-32 h-32 rounded relative">
          <Image
            loading="lazy"
            src={imageUrl}
            height={1000}
            width={1000}
            alt={member.name}
            placeholder="blur"
            blurDataURL="/Falcon.svg"
            className="h-full w-full object-cover absolute z-10"
          />
        </div>
      </div>
      <a
        href={member.linkedinUrl}
        className="text-sm sm:text-md font-bold flex flex-row items-center gap-1 hover:text-accent cursor-pointer"
      >
        {member.name}
        {member.linkedinUrl && (
          <Image
            src={'/social-linkedin.svg'}
            height={20}
            width={20}
            alt="LinkedIn"
            className="h-5 w-5 dark:invert"
          />
        )}
      </a>
      <div className="text-xs sm:text-sm">{member.role || 'volunteer'}</div>
    </div>
  )
}

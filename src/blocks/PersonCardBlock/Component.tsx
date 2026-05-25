import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { PersonCardBlock as PersonCardBlockProps, Member } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { SectionTitle } from '@/components/SectionTitle'
import Image from 'next/image'
import { cn } from '@/utilities/ui'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'

const PersonCard: React.FC<{ member: Member }> = ({ member }) => {
  const imageUrl =
    member.image && typeof member.image === 'object' && member.image.url
      ? member.image.url
      : '/Falcon.svg'

  const bglessImageUrl =
    member.bgless_image && typeof member.bgless_image === 'object' && member.bgless_image.url
      ? member.bgless_image.url
      : '/Falcon.svg'

  const imageAlt =
    member.image && typeof member.image === 'object' && member.image.alt
      ? member.image.alt
      : member.name

  const card = (
    <div className="rounded-2xl shadow-lg overflow-hidden flex flex-col h-full aspect-[4/5] bg-primary relative group/card">
      {/* LinkedIn link indicator */}
      {member.linkedinUrl && (
        <div className="absolute top-3 right-3 z-10 bg-base-100 text-primary rounded-full p-2 shadow-md transition-transform duration-200 group-hover/card:scale-110">
          <FaArrowUpRightFromSquare className="h-3.5 w-3.5 font-semibold" />
        </div>
      )}

      {/* Square image at the top with effects */}
      <div className="relative aspect-square w-full">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover object-top grayscale"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Primary color overlay with mix-blend-mode screen */}
        <div className="absolute inset-0 bg-primary mix-blend-screen" />

        <Image
          src={bglessImageUrl}
          alt={imageAlt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Bottom half gradient fading into the text area below */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-primary via-transparent to-transparent">
          <div className="h-3/5" />
          <div className="flex flex-col gap-1.5 px-6 pb-4 pt-4 xl:pt-6 2xl:pt-8 text-lg md:text-base lg:text-base xl:text-base 2xl:text-lg">
            <p className="text-primary-content font-bold leading-snug  md:text-xl lg:text-lg xl:text-base 2xl:text-lg">
              {member.name}
            </p>
            {member.role && <p className="text-primary-content/80 leading-snug">{member.role}</p>}
          </div>
        </div>
      </div>
    </div>
  )

  if (member.linkedinUrl) {
    return (
      <a
        href={member.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
        aria-label={`${member.name} on LinkedIn`}
      >
        {card}
      </a>
    )
  }

  return card
}

export const PersonCardBlock: React.FC<PersonCardBlockProps> = async ({ title, members, links }) => {
  const resolvedMembers: Member[] = []

  if (members && members.length > 0) {
    const payload = await getPayload({ config })
    const ids = members
      .map((m) => (typeof m.member === 'number' ? m.member : m.member?.id))
      .filter((id): id is number => typeof id === 'number')

    if (ids.length > 0) {
      const { docs } = await payload.find({
        collection: 'members',
        where: { id: { in: ids } },
        depth: 2,
        limit: ids.length,
      })
      const order = Object.fromEntries(ids.map((id, i) => [id, i]))
      resolvedMembers.push(...(docs as Member[]).sort((a, b) => order[a.id] - order[b.id]))
    }
  }

  const count = resolvedMembers.length

  // Columns per breakpoint: mobile=1, sm=2, lg=3, xl=4
  // Determine at which breakpoint overflow first disappears (monotone: if fits on mobile it fits everywhere)
  type OverflowBreak = 'never' | 'sm' | 'lg' | 'xl' | 'always'
  const overflowBreak: OverflowBreak =
    count <= 1 ? 'never' :
    count === 2 ? 'sm' :
    count === 3 ? 'lg' :
    count === 4 ? 'xl' :
    'always'

  // Title wrapper: justify-between (left title + right arrow) when overflowing, justify-center when not
  const titleWrapperClass: Record<OverflowBreak, string> = {
    never:  'flex justify-center mb-8',
    sm:     'flex items-end justify-between mb-8 sm:justify-center',
    lg:     'flex items-end justify-between mb-8 lg:justify-center',
    xl:     'flex items-end justify-between mb-8 xl:justify-center',
    always: 'flex items-end justify-between mb-8',
  }

  // Title text: centered when no overflow at that breakpoint (left is default)
  const titleTextClass: Record<OverflowBreak, string> = {
    never:  'text-center',
    sm:     'sm:text-center',
    lg:     'lg:text-center',
    xl:     'xl:text-center',
    always: '',
  }

  // Arrow: hidden when no overflow at that breakpoint
  const arrowClass: Record<OverflowBreak, string> = {
    never:  'hidden',
    sm:     'text-xl shrink-0 sm:hidden',
    lg:     'text-xl shrink-0 lg:hidden',
    xl:     'text-xl shrink-0 xl:hidden',
    always: 'text-xl shrink-0',
  }

  // Card widths sized to show exactly N cards; extras overflow and scroll
  // gap-20 = 80px. N=2: 50%-40px, N=3: 33.33%-53px, N=4: 25%-60px
  const cardWrapperClass =
    'shrink-0 snap-center w-[80vw] max-w-xs sm:w-[calc(50%-40px)] lg:w-[calc(33.33%-53px)] xl:w-[calc(25%-60px)]'

  return (
    <section className="container">
      <SectionTitle
        title={title}
        arrow={arrowClass[overflowBreak]}
        className={cn(titleWrapperClass[overflowBreak], 'lg:py-4')}
        textClassName={titleTextClass[overflowBreak]}
      />

      <div className="flex flex-row gap-4 sm:gap-10 md:gap-16 py-6 px-2 lg:gap-20 overflow-x-auto snap-x snap-mandatory pb-2">
        {resolvedMembers.map((member) => (
          <div key={member.id} className={cardWrapperClass}>
            <PersonCard member={member} />
          </div>
        ))}
      </div>

      {links && links.length > 0 && (
        <div className="flex justify-center gap-4 mt-8">
          {links.map(({ link }, i) => (
            <CMSLink key={i} size="lg" {...link} />
          ))}
        </div>
      )}
    </section>
  )
}

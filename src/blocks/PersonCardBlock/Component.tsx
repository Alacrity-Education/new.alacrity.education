import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { PersonCardBlock as PersonCardBlockProps, Member } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Image from 'next/image'
import { cn } from '@/utilities/ui'

const PersonCard: React.FC<{ member: Member }> = ({ member }) => {
  const imageUrl =
    member.image && typeof member.image === 'object' && member.image.url
      ? member.image.url
      : '/Falcon.svg'

  const imageAlt =
    member.image && typeof member.image === 'object' && member.image.alt
      ? member.image.alt
      : member.name

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden flex flex-col h-full aspect-[4/5] bg-primary">
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
        {/* Bottom half gradient fading into the text area below */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-primary via-transparent to-transparent">
          <div className={"h-3/5"}></div>
          <div className="flex flex-col gap-1.5 px-6 pb-4 pt-4 xl:pt-6 2xl:pt-8 text-lg md:text-lg lg:text-lg xl:text-base 2xl:text-xl">
            <p className="text-primary-content font-bold leading-snug">{member.name}</p>
            {member.role && (
              <p className="text-primary-content/80 leading-snug">{member.role}</p>
            )}
          </div>
        </div>
      </div>

      {/* Text below the image */}
    </div>
  )
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

  const baseTypography =
    'text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary mt-0 mb-2 sm:mb-4 md:mb-6 lg:mb-8'
  // Card widths sized to show exactly N cards; extras overflow and scroll
  // gap-20 = 80px. N=2: 50%-40px, N=3: 33.33%-53px, N=4: 25%-60px
  const cardWrapperClass =
    'shrink-0 snap-center w-[80vw] max-w-xs sm:w-[calc(50%-40px)] lg:w-[calc(33.33%-53px)] xl:w-[calc(25%-60px)]'

  return (
    <section className="container">
      {title && (
        <div className={cn(titleWrapperClass[overflowBreak],"lg:py-4")}>
          <p className={cn(`mb-0 ${titleTextClass[overflowBreak]}`, baseTypography)}>
            {title} <span className={cn(arrowClass[overflowBreak], baseTypography)}>→</span>
          </p>
        </div>
      )}

      <div className="flex flex-row gap-4 sm:gap-10 md:gap-16 py-2 px-2 lg:gap-20 overflow-x-auto snap-x snap-mandatory pb-2">
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

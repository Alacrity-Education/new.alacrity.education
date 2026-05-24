"use client";

import React from 'react'
import {useRef} from 'react'
import type { Timeline as TimelineProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { SectionTitle } from '@/components/SectionTitle'
import { link } from 'node:fs'

const Tbr = ({ className }: { className?: string }) => (
  <svg className={cn('h-10 text-gray-300 ', className)} width="2" xmlns="http://www.w3.org/2000/svg">
    <line
      x1="1"
      y1="0"
      x2="1"
      y2="100%"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
  </svg>
)

type TimelineElementsType = TimelineProps['timelineElements'];
type LinkType = NonNullable<TimelineProps['timelineElements']>[number]['link']

export function TimelineCard({ time, text, link }: { time: string; text: DefaultTypedEditorState | undefined | null, link: LinkType }) {
  return (
    <div className="relative flex flex-col w-[80vw] sm:w-xs">
      <Tbr />
      <div className="relative badge badge-primary badge-md text-base-300 shadow-lg rounded-md">
        {new Date(time).toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </div>
      <div className="pt-4 h-full max-h-max overflow-clip">
        {text && <RichText className={'pl-0! ml-0! prose-sm pb-4 prose-p:text-base'} data={text} />}
        {link&&<CMSLink {...link} className={"has-external-arrow  btn-sm!"} />}
      </div>
    </div>
  )
}

export const Timeline :  React.FC<TimelineProps> = ({ timelineElements, title }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollAmount = 400

  // Oldest elements go to the left, newest to the right.
  // Payload prepends new array items (index 0 = newest), so reverse to get chronological order.
  const elements = [...(timelineElements || [])]

  // On mount, jump to the right end so the newest element is immediately visible.
  React.useEffect(() => {
    const el = scrollContainerRef.current
    if (el) el.scrollLeft = el.scrollWidth - el.clientWidth
  }, [])

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <div className="w-full container">
      <SectionTitle title={title} className="mb-6" />
      <div className="relative min-h-[60vh] sm:min-h-[50vh] h-max w-full bg-base-100 flex flex-col items-start p-10 border-4 border-primary dark:border-primary/30 rounded-lg shadow-xl">
        {/* Left arrow → older elements */}
        <button
          onClick={scrollLeft}
          className="block btn btn-xl z-10 absolute left-10 bottom-10 btn-circle btn-primary hover:-translate-y-1 transition-all"
        >
          <LeftArrow className="h-full w-full invert" />
        </button>

        <div
          ref={scrollContainerRef}
          style={{ scrollbarGutter: 'stable' }}
          className="h-full w-full max-w-full overflow-x-scroll absolute top-0 left-0 scrollbar-visible"
        >
          <div className="relative w-max min-w-full h-max py-10 sm:py-10 pl-10 flex flex-col">
            {/* horizontal timeline line; elements hang below it left→right oldest→newest */}
            <div className={'absolute h-1.5 w-full bg-primary z-10 -left-[70vw] md:-left-[50vw] lg:-left-[20vw]'}></div>
            <div className="flex flex-row gap-4 border-t-6 border-dashed border-primary/60">
              {elements.map((timelineElement, index) => (
                <TimelineCard
                  key={index}
                  time={timelineElement.date || ''}
                  text={timelineElement.description}
                  link={timelineElement.link}
                />
              ))}
              <div className="w-0 sm:w-20 md:w-xs"></div>
            </div>
          </div>
        </div>

        {/* Right arrow → newer elements */}
        <button
          onClick={scrollRight}
          className="block btn btn-xl z-10 absolute right-10 bottom-10 btn-circle btn-primary hover:-translate-y-1 transition-all"
        >
          <RightArrow className="h-full w-full invert" />
        </button>
      </div>
    </div>
  )
}

const ArrowSymbol = ({ className }: { className: string }) => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 12H18M18 12L13 7M18 12L13 17"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const RightArrow = ({ className }: { className: string }) => {
  return <ArrowSymbol className={className} />
}

export const DownArrow = ({ className }: { className: string }) => {
  return <ArrowSymbol className={className + ' rotate-90'} />
}

const LeftArrow = ({ className }: { className: string }) => {
  return <ArrowSymbol className={className + ' rotate-180'} />
}

"use client";

import React from 'react'
import {useRef} from 'react'
import type { Timeline as TimelineProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export function TimelineCard({ time, text }: { time: string; text: DefaultTypedEditorState | undefined | null }) {
  return (
    <div className="relative  sm:border-l-4  pb-10 sm:pb-0  w-full sm:w-96  h-max py-4 border-primary/70 sm:border-black dark:border-primary sm:border-solid">
      {/* <div className="absolute h-5 w-5 rounded-full bg-black dark:bg-white -left-2 -top-2"></div> */}
      <div className="p-4 relative">
        <div className="h-1 bg-primary w-10 left-0 top-7 absolute sm:hidden"></div>
        <div className=" relative badge badge-primary badge-sm sm:badge-md text-base-300 shadow-lg">
          {time}
        </div>
        <div className="sm:text-lg pt-4">{text && <RichText data={text} />}</div>
      </div>
    </div>
  )
}

export const Timeline :  React.FC<TimelineProps> = ({ timelineElements, blockTitle }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollAmount = 400 // pixels per click

  const scrollLeft = () => {
    scrollContainerRef.current!.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    })
  }

  const scrollRight = () => {
    scrollContainerRef.current!.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    })
  }
  return (
    <div className={"w-full p-8 sm:p-10"}>
      <div className="relative min-h-[70vh] h-max w-full bg-base-200 flex flex-col items-start p-10 border-4 border-primary dark:border-primary/30 rounded-lg shadow-xl">
        <button
          onClick={scrollLeft}
          className="hidden sm:block btn btn-xl z-10 absolute left-10 bottom-10 btn-circle btn-primary hover:-translate-y-1 transition-all"
        >
          <LeftArrow className="h-full w-full invert" />
        </button>
        <div
          ref={scrollContainerRef}
          style={{ scrollbarGutter: 'stable' }}
          className="max-w-full h-full w-full sm:w-max overflow-x-scroll absolute top-0 left-0 scrollbar-visible px-4 sm:px-0"
        >
          <div className="relative w-full sm:w-max sm:min-w-screen h-max py-4 sm:p-10 flex flex-row sm:flex-col    ">
            <div className="flex flex-col sm:flex-row gap-4 border-l-4 border-primary sm:border-l-0 sm:border-t-4 sm:border-primary">
              {timelineElements &&
                timelineElements.map((timelineElement, index) => (
                  <TimelineCard
                    key={index}
                    time={timelineElement.date || ''}
                    text={timelineElement.description}
                  />
                ))}
            </div>
          </div>
        </div>
        <button
          onClick={scrollRight}
          className="hidden sm:block btn btn-xl z-10 absolute right-10 bottom-10 btn-circle btn-primary hover:-translate-y-1 transition-all"
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

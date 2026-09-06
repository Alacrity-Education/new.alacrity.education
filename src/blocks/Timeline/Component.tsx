'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { Timeline as TimelineProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { SectionTitle } from '@/components/SectionTitle'
import { hasRichTextContent } from '@/utilities/richText'
import { cn } from '@/utilities/ui'

type Entry = NonNullable<TimelineProps['timelineElements']>[number]

/**
 * Tailwind's `md`, in rem so it tracks the theme rather than drifting from the
 * `md:` classes if the root font size changes. Images only exist from md up, so
 * the parallax has nothing to do below it. Reduced-motion users opt out
 * entirely — matchMedia reverts the tweens when either clause stops matching.
 */
const PARALLAX_QUERY = '(min-width: 48rem) and (prefers-reduced-motion: no-preference)'

/**
 * The rail and the badge that straddles it. Every horizontal offset below is
 * derived from these two, so the geometry stays consistent:
 *   rail 2.5rem wide, centre at 1.25rem
 *   badge 3rem, so its left edge sits at 1.25rem - 1.5rem = -0.25rem
 */
/**
 * Horizontal geometry only — each use states its own vertical span. twMerge does
 * not treat `inset-y-*` as conflicting with `top-*`/`bottom-*`, so baking a
 * default in here would leave the winner to Tailwind's stylesheet order rather
 * than to the caller.
 */
const RAIL = 'absolute left-0 w-10 rounded-full'
const RAIL_FILL = 'bg-brand-900'

/**
 * Month + year, e.g. "March 2024". Timezone-agnostic on purpose: Payload stores
 * a UTC instant, and formatting that in the viewer's zone can roll a date on
 * the 1st back into the previous month.
 */
const formatEyebrow = (value?: string | null): string | null => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}
const BADGE = 'absolute -left-2 -top-2 z-20 grid size-14 place-items-center rounded-full'

/** Clears the rail and the connector stub. */
const ENTRY_INSET = 'pl-16 md:pl-28'

const TimelineEntry: React.FC<{ entry: Entry; index: number }> = ({ entry, index }) => {
  const highlighted = Boolean(entry.highlight)
  const eyebrow = formatEyebrow(entry.date)

  return (
    <article
      className={cn(
        'relative',
        ENTRY_INSET,
        "overflow-visible",
        "min-h-64"
        // z-20 lifts the whole entry above the shared rail (z-10) so the filled
        // panel covers it, and the white segment below stands in for it.
        // highlighted && 'z-20 rounded-3xl bg-primary py-8 pr-6 md:py-10 md:pr-10',
      )}
    >
      {highlighted && <div className='bg-primary absolute inset-y-[-30px] inset-x-[-100%] rounded-box  z-0 '></div>}
      {/* The rail turns white as it crosses a highlighted entry. Same geometry
          as the shared rail, painted over the panel that just hid it. */}
      {highlighted && (
        <div aria-hidden="true" className={cn(RAIL, 'inset-y-[-100px] rounded-full z-20 bg-linear-to-b from-brand-900 to-brand-900 via-base-100  ')} />
      )}
      <div className={cn(BADGE, 'bg-brand-500 text-primary-content ',highlighted && "bg-base-300 text-primary",  eyebrow && "top-5")} aria-hidden="true">
        <span className="text-lg font-semibold leading-none">{index + 1}</span>
      </div>

      <div
        aria-hidden="true"
        className={cn("hidden absolute left-10 top-0 h-10 w-10 sm:w-20 z-10  bg-linear-to-r from-brand-900 to-transparent md:w-20 lg:block"
          ,
          highlighted && "bg-linear-to-r from-base-100/50 to-transparent",
          eyebrow && "top-7"
        )}
      />

      <div className="flex flex-col relative z-20 gap-14 lg:flex-row lg:items-start justify-between w-full lg:gap-24">
        <div className="min-w-0  lg:max-w-sm lg:basis-md xl:max-w-md xl:basis- shrink-0">
          {eyebrow && (
            <p
              className={cn(
                'eyebrow mb-3',
                highlighted ? 'text-primary-content!' : 'text-ink-muted',
              )}
            >
              {eyebrow}
            </p>
          )}

          {hasRichTextContent(entry.description) && (
            // Sizes come from .prose-alacrity via prose-md, same as every other
            // rich text field. prose-on-primary only repoints the palette.
            <RichText
              data={entry.description}
              enableGutter={false}
              className={cn('prose-md mx-0', highlighted && 'prose-on-primary')}
            />
          )}

          {entry.enableLink && entry.link && (
            <div className="mt-6">
              <CMSLink
                {...entry.link}
                // On the filled panel the CMS appearance would sit primary on
                // primary, so it is overridden at render rather than adding
                // panel-only options to the field.
                appearance={highlighted ? 'baseOverlap' : (entry.link.appearance ?? 'primary')}
              />
            </div>
          )}
        </div>


        {entry.image && (
          // The figure absorbs the space the copy column leaves; justify-end
          // then pins the (narrower) image to the far right of it.
          //
          // It has to be justify-* on this container, not place-self on the
          // child: `justify-self` is ignored in flex layout, so `place-self-end`
          // only ever moved the image down, never right.
          <figure className="timeline-figure hidden min-w-0 w-full justify-end lg:flex">
            <div className="relative aspect-4/3 w-4/5 overflow-hidden rounded-box">
              {/* Oversized by 12% a side so the ±8% drift never exposes an edge. */}
              <div className="timeline-figure__inner absolute -inset-[12%]">
                <Media
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover"
                  resource={entry.image}
                />
              </div>
            </div>
          </figure>
        )}
      </div>
    </article>
  )
}

export const Timeline: React.FC<TimelineProps> = ({ timelineElements, title }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const entries = timelineElements ?? []

  useEffect(() => {
    if (!entries.length) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(PARALLAX_QUERY, () => {
        gsap.utils.toArray<HTMLElement>('.timeline-figure').forEach((figure) => {
          const inner = figure.querySelector<HTMLElement>('.timeline-figure__inner')
          if (!inner) return

          // Entrance: the "loads in" half.
          gsap.from(figure, {
            autoAlpha: 0,
            y: 32,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: figure, start: 'top 85%' },
          })

          // Drift: the image runs slower than the page across its own frame.
          gsap.fromTo(
            inner,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: figure,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [entries.length])

  if (!entries.length) return null

  return (
    <div className="container" ref={containerRef}>
      <SectionTitle title={title} className="lg:py-4" />

      <div className="relative overflow-visible py-20">
        <div aria-hidden="true" className={cn(RAIL, RAIL_FILL, 'top-6  bottom-6 z-10')} />

        <ol className="space-y-20 md:space-y-28 flex flex-col gap-10">
          {entries.map((entry, i) => (
            <li key={entry.id ?? i}>
              <TimelineEntry entry={entry} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

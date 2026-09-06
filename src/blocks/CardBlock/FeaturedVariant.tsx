'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { CardBlock as CardBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { SectionTitle } from '@/components/SectionTitle'
import { ImageStack } from './ImageStack'
import { hasRichTextContent } from '@/utilities/richText'

type FeaturedCards = NonNullable<CardBlockProps['featuredCards']>

/**
 * Tailwind's `md`, verbatim. The GSAP query and every `md:` class below have to
 * agree exactly: at any width where they disagree you get the stacked layout
 * with the pinned parallax, or the row layout without it. The old 800px query
 * sat between two breakpoints and did exactly that.
 *
 * Written in rem, not the 768px it currently resolves to, because Tailwind
 * emits `@media (width >= 48rem)` — so the boundary moves with the root font
 * size. A reader who has bumped their browser's default font would otherwise
 * cross the CSS breakpoint and the JS one at two different widths.
 */
const PARALLAX_QUERY = '(min-width: 48rem)'

export const FeaturedVariant: React.FC<{
  title?: string | null
  cards?: FeaturedCards | null
}> = ({ title, cards }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const CARD_STAGGER = 24

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Parallax is md-and-up only. Below that the cards are a plain vertical
      // stack, so there is no second branch here: matchMedia reverts every pin
      // and transform on its own when the query stops matching, which also
      // covers resizing down across the breakpoint.
      mm.add(PARALLAX_QUERY, () => {
        const wrappers = gsap.utils.toArray<HTMLElement>('.gsap-card-wrapper')
        const cardsElements = gsap.utils.toArray<HTMLElement>('.gsap-card')
        const sectionEl = containerRef.current
        const titleEl = titleRef.current
        const lastWrapper = wrappers[wrappers.length - 1]
        const lastCard = cardsElements[cardsElements.length - 1]

        // Pin the title for the same scroll distance as the last card's pin.
        if (lastWrapper && lastCard) {
          const lastIndex = cardsElements.length - 1
          ScrollTrigger.create({
            trigger: sectionEl,
            start: () => `top top+=${window.innerHeight * 0.1}`,
            endTrigger: sectionEl,
            end: () =>
              `bottom top+=${
                window.innerHeight * 0.1 + 100 + lastIndex * CARD_STAGGER + lastCard.offsetHeight
              }`,
            pin: titleEl,
            pinSpacing: false,
            invalidateOnRefresh: true,
          })
        }

        wrappers.forEach((wrapper, i) => {
          const card = cardsElements[i]
          let scale = 1
          let rotation = 0

          if (i !== cardsElements.length - 1) {
            scale = 0.9 + 0.025 * i
            rotation = -10
          }
          if (card) {
            gsap.to(card, {
              scale: scale,
              rotationX: rotation,
              transformOrigin: 'top center',
              ease: 'none',
              scrollTrigger: {
                trigger: wrapper,
                start: () => `top top+=${window.innerHeight * 0.1 + 100 + i * CARD_STAGGER}`,
                endTrigger: sectionEl,
                end: () =>
                  `bottom top+=${
                    window.innerHeight * 0.1 + 100 + i * CARD_STAGGER + wrapper.offsetHeight
                  }`,
                scrub: true,
                pin: wrapper,
                pinSpacing: false,
                invalidateOnRefresh: true,
              },
            })
          }
        })

        ScrollTrigger.refresh()
      })
    }, containerRef)

    return () => ctx.revert()
  }, [cards])

  return (
    <>
      {/* pb-[40lvh] is scroll runway for the pinned cards, so it only applies
          where the pinning does — below md it would just be dead space. */}
      <section
        ref={containerRef}
        className="container relative pb-16 md:pb-[40lvh]  gsap-section-wrapper"
      >
        <SectionTitle
          ref={titleRef}
          title={title}
          arrow
          // No `container` here: this sits inside the section's own container,
          // and nesting them added a second 1rem/2rem of inline padding, so the
          // title read as indented relative to the cards below it.
          className="relative z-10 py-4 h-fit bg-transparent"
        />

        {/* Real gap between stacked cards; at md+ the pins overlap them by
            design and the per-card margins take over. */}
        <div className="flex flex-col gap-8 md:gap-0 mt-8 items-center">
          {(cards || []).map((card, i) => (
            <div
              key={i}
              className="gsap-card-wrapper relative w-full md:mb-[40lvh] md:last:mb-[15lvh] md:[perspective:1000px]"
            >
              <div className="gsap-card w-full h-max rounded-2xl border-4 border-primary/50 bg-base-100 shadow-xl overflow-hidden">
                {/* flex-col-reverse puts the gallery above the text while
                    keeping the text first in the DOM and reading order. */}
                <div className="flex flex-col-reverse md:flex-row h-max p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 gap-8 md:gap-6">
                  <div className="flex flex-col flex-1 min-w-0 ">
                    {hasRichTextContent(card.richText) && (
                      <RichText
                        className="mb-0 prose-h2:text-primary prose-h3:text-primary w-full lg:pr-16"
                        data={card.richText}
                        enableGutter={false}
                      />
                    )}

                    <div className="flex-1" />

                    {card.links && card.links.length > 0 && (
                      <div className="flex flex-row flex-wrap gap-4 pt-4 justify-end md:justify-start">
                        {card.links.map(({ link }, j) => (
                          <CMSLink key={j} size={'lg'} {...link} />
                        ))}
                      </div>
                    )}
                  </div>

                  {card.gallery && card.gallery.length > 0 && (
                    <div className="w-full md:w-2/5 shrink-0">
                      <ImageStack images={card.gallery} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

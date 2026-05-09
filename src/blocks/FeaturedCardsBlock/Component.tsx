'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { FeaturedCardsBlock as FeaturedCardsBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const FeaturedCardsBlock: React.FC<FeaturedCardsBlockProps> = ({ sectionTitle, cards }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const CARD_STAGGER = 24

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 640px)', () => {
        const wrappers = gsap.utils.toArray<HTMLElement>('.gsap-card-wrapper')
        const cardsElements = gsap.utils.toArray<HTMLElement>('.gsap-card')
        const sectionEl = containerRef.current
        const titleEl = titleRef.current
        const lastWrapper = wrappers[wrappers.length - 1]
        const lastCard = cardsElements[cardsElements.length - 1]

        // Pin the title for the same scroll distance as the last card's pin.
        // The last card pins at: top+=15vh + 100 + (n-1)*CARD_STAGGER
        // and releases when the section bottom passes that line + card height.
        if (titleEl && lastWrapper && lastCard) {
          const lastIndex = cardsElements.length - 1
          ScrollTrigger.create({
            trigger: sectionEl,
            start: 'top top',
            endTrigger: sectionEl,
            end: () =>
              `bottom top+=${
                window.innerHeight * 0.15 + 100 + lastIndex * CARD_STAGGER + lastCard.offsetHeight
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

          gsap.to(card, {
            scale: scale,
            rotationX: rotation,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: () => `top top+=${window.innerHeight * 0.15 + 100 + i * CARD_STAGGER}`,
              endTrigger: sectionEl,
              end: () =>
                `bottom top+=${
                  window.innerHeight * 0.15 + 100 + i * CARD_STAGGER + wrapper.offsetHeight
                }`,
              scrub: true,
              pin: wrapper,
              pinSpacing: false,
              invalidateOnRefresh: true,
            },
          })
        })

        ScrollTrigger.refresh()
      })
    }, containerRef)

    return () => ctx.revert()
  }, [cards])

  return (
    <section
      ref={containerRef}
      className="container relative pb-12 sm:pb-[40vh] gsap-section-wrapper"
    >
      {sectionTitle && (
        <div ref={titleRef} className="relative sm:top-[15vh] z-0 bg-base-100 py-4 h-fit">
          <p className="text-primary text-2xl md:text-3xl lg:text-4xl font-extrabold mt-0 mb-2  md:mb-6 lg:mb-8">
            {sectionTitle} &rarr;
          </p>
        </div>
      )}

      <div className="flex flex-row sm:flex-col gap-6 sm:gap-0 mt-8 items-stretch sm:items-center overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none pb-8 sm:pb-0">
        {(cards || []).map((card, i) => (
          <div
            key={i}
            className="
              gsap-card-wrapper
              relative
              shrink-0 sm:shrink
              w-[85vw] max-w-xs sm:w-full sm:max-w-full
              snap-center sm:snap-align-none
              mb-0 sm:mb-[40vh] sm:last:mb-[15vh]
              [perspective:1000px]
            "
          >
            <div className="gsap-card w-full h-max rounded-2xl border-2 border-base-300 bg-base-100 shadow-xl overflow-hidden">
              <div className="flex flex-col-reverse sm:flex-row h-128 sm:h-max p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 gap-6">
                <div className="flex flex-col flex-1 min-w-0">
                  {card.richText && (
                    <RichText
                      className="mb-0 prose-h2:text-primary prose-h3:text-primary w-full"
                      data={card.richText}
                      enableGutter={false}
                    />
                  )}

                  <div className="flex-1" />

                  {card.links && card.links.length > 0 && (
                    <div className="flex flex-row flex-wrap gap-4 pt-4 justify-end sm:justify-start">
                      {card.links.map(({ link }, j) => (
                        <CMSLink key={j} size={'lg'} {...link} />
                      ))}
                    </div>
                  )}
                </div>

                {card.media && (
                  <div className="w-full sm:w-2/5 aspect-square shrink-0 rounded-xl overflow-hidden">
                    <Media
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                      resource={card.media}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

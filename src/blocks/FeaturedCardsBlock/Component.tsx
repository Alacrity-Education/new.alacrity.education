'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { FeaturedCardsBlock as FeaturedCardsBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { SectionTitle } from '@/components/SectionTitle'
import { ImageStack } from './ImageStack'

export const FeaturedCardsBlock: React.FC<FeaturedCardsBlockProps> = ({ title, cards }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const CARD_STAGGER = 24

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 800px)', () => {
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

      mm.add('(max-width: 799px)', () => {
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
            start: () => `top top+=${window.innerHeight * 0.02}`,
            endTrigger: sectionEl,
            end: () =>
              `bottom top+=${
                window.innerHeight * 0.02 + 100 + lastIndex * CARD_STAGGER + lastCard.offsetHeight
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
                start: () => `top top+=${window.innerHeight * 0.02 + 100 + i * CARD_STAGGER}`,
                endTrigger: sectionEl,
                end: () =>
                  `bottom top+=${
                    window.innerHeight * 0.02 + 100 + i * CARD_STAGGER + wrapper.offsetHeight
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
      <section ref={containerRef} className="container relative pb-[40lvh] gsap-section-wrapper">
        <SectionTitle
          ref={titleRef}
          title={title}
          arrow
          className="container relative z-10 py-4 h-fit bg-transparent"
        />

        <div className="flex flex-col gap-0 mt-8 items-center">
          {(cards || []).map((card, i) => (
            <div
              key={i}
              className="gsap-card-wrapper relative w-full mb-[40lvh] last:mb-[15lvh] [perspective:1000px]"
            >
              <div className="gsap-card w-full h-max rounded-2xl border-4 border-primary/50 bg-base-100 shadow-xl overflow-hidden">
                <div className="flex flex-col-reverse sm:flex-row h-max p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 gap-6">
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

                  {card.gallery && card.gallery.length > 0 && (
                    <div className="w-full sm:w-2/5 shrink-0">
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

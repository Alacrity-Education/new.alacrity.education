'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

//const SCROLL_INTERVAL_MS = 1000
const SCROLL_THRESHOLD = 1

interface CarouselItem {
  href: string
  src: string
  alt: string
}

interface CarouselProps {
  title: string
  items: CarouselItem[]
  children?: ReactNode
}

export const CarouselCard: React.FC<{
  href: string
  src: string
  alt: string
}> = ({ href, src, alt }) => {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <div className="flex items-center justify-center h-40 bg-white rounded-lg overflow-hidden flex-shrink-0 min-w-[250px] hover:shadow-lg transition-shadow">
        <Image src={src} alt={alt} width={200} height={140} className="object-contain p-4" />
      </div>
    </Link>
  )
}

const Carousel: React.FC<CarouselProps> = ({ title, children }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > SCROLL_THRESHOLD)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - SCROLL_THRESHOLD)
    }
  }

  useEffect(() => {
    updateScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollButtons)
      window.addEventListener('resize', updateScrollButtons)

      return () => {
        container.removeEventListener('scroll', updateScrollButtons)
        window.removeEventListener('resize', updateScrollButtons)
      }
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="w-full py-16 bg-slate-950">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">{title}</h2>

        <div ref={containerRef} className="relative">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              aria-label="Scroll left"
            >
              <svg
                className="w-6 h-6 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              aria-label="Scroll right"
            >
              <svg
                className="w-6 h-6 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Carousel scrollable container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-12 pb-4"
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carousel

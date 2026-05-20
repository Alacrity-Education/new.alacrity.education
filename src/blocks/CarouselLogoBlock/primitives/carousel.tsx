'use client'

import React, { ReactNode, useEffect, useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

interface CarouselProps {
  children?: ReactNode
}

export const CarouselCard = ({ media, link }: { media: MediaType | number; link: string }) => (
  <Link href={link} target="_blank" rel="noopener noreferrer">
    <div className="flex items-center justify-center h-30 sm:h-40 aspect-square bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow shrink-0">
      <Media
        imgClassName="h-full w-full object-cover"
        pictureClassName="h-full w-full"
        className="h-full w-full"
        resource={media}
      />
    </div>
  </Link>
)

// Exponential-decay spring — higher = snappier (0.1 sluggish … 0.25 snappy)
const FRICTION = 0.18
// Auto-scroll speed in px per frame at 60 fps (1 ≈ 60 px/s)
const AUTO_SPEED = 1

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const trackRef  = useRef<HTMLDivElement>(null)
  const copy1Ref  = useRef<HTMLDivElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const posRef    = useRef(0)    // current animated position
  const targetRef = useRef(0)    // destination the spring chases
  const pausedRef = useRef(false)
  const rafRef    = useRef<number | null>(null)

  const items = React.Children.toArray(children).filter(Boolean)

  // Width of one copy: items + internal gap-6 spacings + trailing pr-6 padding
  // (the trailing padding makes the inter-copy visual gap match the inter-item gap)
  const getW = () => copy1Ref.current?.offsetWidth ?? 0

  // Map any raw position into the middle-copy zone (-2W, -W] via modulo (O(1)).
  // Because all three copies are identical, the wrap is undetectable.
  const normalise = (raw: number, W: number): number => {
    if (W < 1) return raw
    const x = ((raw + 2 * W) % W + W) % W
    return x === 0 ? -W : x - 2 * W
  }

  const applyTransform = (raw: number) => {
    const track = trackRef.current
    const W = getW()
    if (!track || W === 0) return
    track.style.transform = `translateX(${normalise(raw, W)}px)`
  }

  // Initialise to the start of the middle copy before the first paint
  useLayoutEffect(() => {
    const W = getW()
    if (!W) return
    posRef.current    = -W
    targetRef.current = -W
    applyTransform(-W)
  }, [items.length])

  // Continuous spring loop — always running so arrow clicks are immediately responsive
  useEffect(() => {
    const tick = () => {
      const W = getW()
      if (W > 0) {
        // Auto-scroll: advance both pos and target together so there is no
        // spring lag for the baseline drift. Paused while the user hovers or touches.
        // Use half speed on narrow screens so fast motion doesn't feel jarring.
        if (!pausedRef.current) {
          const speed = window.innerWidth < 640 ? AUTO_SPEED * 0.5 : AUTO_SPEED
          posRef.current    -= speed
          targetRef.current -= speed
        }

        // When pos crosses a copy boundary, normalise it and shift target by the
        // same delta so the spring's remaining distance is perfectly preserved.
        const n = normalise(posRef.current, W)
        if (n !== posRef.current) {
          targetRef.current += n - posRef.current
          posRef.current = n
        }

        const diff = targetRef.current - posRef.current
        if (Math.abs(diff) < 0.3) {
          posRef.current = targetRef.current
        } else {
          posRef.current += diff * FRICTION
        }
        applyTransform(posRef.current)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [items.length])

  // Pause auto-scroll on hover and touch
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const pause  = () => { pausedRef.current = true  }
    const resume = () => { pausedRef.current = false }
    el.addEventListener('mouseenter',  pause)
    el.addEventListener('mouseleave',  resume)
    el.addEventListener('touchstart',  pause,  { passive: true })
    el.addEventListener('touchend',    resume)
    el.addEventListener('touchcancel', resume)
    return () => {
      el.removeEventListener('mouseenter',  pause)
      el.removeEventListener('mouseleave',  resume)
      el.removeEventListener('touchstart',  pause)
      el.removeEventListener('touchend',    resume)
      el.removeEventListener('touchcancel', resume)
    }
  }, [])

  // Re-anchor when copy width changes (e.g. responsive card size breakpoint hit)
  useEffect(() => {
    const el = copy1Ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const W = el.offsetWidth
      if (W < 1) return
      const n = normalise(posRef.current, W)
      if (n !== posRef.current) {
        targetRef.current += n - posRef.current
        posRef.current = n
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    targetRef.current += dir === 'left' ? 300 : -300
  }

  if (items.length === 0) return null

  return (
    <div ref={wrapRef} className="w-full py-16">
      <div className="relative">

        {/* Arrows live outside the overflow-hidden clip so they are never cropped */}
        <div className="absolute inset-0 container pointer-events-none z-10">
          <button
            onClick={() => scroll('left')}
            className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* overflow-hidden clips the wide track; px-12 keeps items clear of the arrows */}
        <div className="overflow-hidden px-12 pb-4">
          {/* Three identical copies of the items side by side.
              pr-6 on each copy adds a trailing gap equal to the inter-item gap,
              so the loop point is visually seamless. */}
          <div ref={trackRef} className="flex will-change-transform">
            <div ref={copy1Ref} className="flex gap-6 shrink-0 pr-6">{items}</div>
            <div className="flex gap-6 shrink-0 pr-6">{items}</div>
            <div className="flex gap-6 shrink-0 pr-6">{items}</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Carousel

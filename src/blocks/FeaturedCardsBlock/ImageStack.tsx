'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

interface ImageStackProps {
  images: Array<{ image: MediaType | number | null; id?: string | null }>
  className?: string
}

// Resting positions for stacked cards. Index 0 is the visible top.
// Tweak these to taste — these match your existing visual rhythm.
const STACK_OFFSETS = [
  { x: 0, y: 0, rotate: 0 },
  { x: 8, y: 6, rotate: 3 },
  { x: -6, y: 10, rotate: -2 },
  { x: 4, y: 14, rotate: 4 },
  { x: -3, y: 18, rotate: -3 },
] as const

const FLIP_DURATION = 0.45
const SETTLE_DURATION = 0.5

export const ImageStack: React.FC<ImageStackProps> = ({ images, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<Array<HTMLDivElement | null>>([])
  const animatingRef = useRef(false)
  const throwDirRef = useRef<1 | -1>(1)

  // Only work with fully-populated image objects (not bare IDs)
  const populated = (images ?? []).filter(
    (item): item is { image: MediaType; id?: string | null } =>
      typeof item.image === 'object' && item.image !== null,
  )

  // `order` holds indices into `populated`, with order[0] being the visible top.
  const [order, setOrder] = useState<number[]>(() => populated.map((_, i) => i))
  const orderRef = useRef(order)
  orderRef.current = order

  const hasStack = populated.length >= 2

  // Set initial stack positions once layers mount.
  useEffect(() => {
    layerRefs.current.forEach((el, i) => {
      if (!el) return
      const offset = STACK_OFFSETS[Math.min(i, STACK_OFFSETS.length - 1)]!
      gsap.set(el, {
        x: offset.x,
        y: offset.y,
        rotation: offset.rotate,
        zIndex: populated.length - i,
      })
    })
  }, [populated.length])

  const flip = useCallback(() => {
    if (animatingRef.current || !hasStack) return
    animatingRef.current = true

    const currentOrder = orderRef.current
    const topPosition = 0
    const topImageIdx = currentOrder[topPosition]
    if (topImageIdx === undefined) {
      animatingRef.current = false
      return
    }

    // The DOM element for the top image — layerRefs are indexed by image idx,
    // not by stack position, so the element doesn't move in the DOM; only its
    // transform changes.
    const topEl = layerRefs.current[topImageIdx]
    if (!topEl) {
      animatingRef.current = false
      return
    }



    const containerWidth = containerRef.current?.offsetWidth ?? 200

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false
      },
    })

    // 1. Throw the top card out.
    tl.to(topEl, {
      x: containerWidth * 1.3,
      y: 30,
      rotation:  22,
      duration: FLIP_DURATION,
      ease: 'power2.in',
    })

    // 2. Reorder: move top to back, others shift up one position.
    tl.add(() => {
      const newOrder = [...currentOrder.slice(1), currentOrder[0]!]
      // Apply new z-indices immediately so the thrown card slips behind.
      newOrder.forEach((imgIdx, pos) => {
        const el = layerRefs.current[imgIdx]
        if (el) gsap.set(el, { zIndex: populated.length - pos })
      })
      // Snap the thrown card to the back position (off the right side of stack,
      // ready to slide in).
      const backOffset = STACK_OFFSETS[Math.min(newOrder.length - 1, STACK_OFFSETS.length - 1)]!
      gsap.set(topEl, {
        x: backOffset.x + 40,
        y: backOffset.y - 8,
        rotation: backOffset.rotate + 8,
      })
      setOrder(newOrder)
    })

    // 3. Settle: animate every card to its new stacked position.
    tl.add(() => {
      const newOrder = [...currentOrder.slice(1), currentOrder[0]!]
      newOrder.forEach((imgIdx, pos) => {
        const el = layerRefs.current[imgIdx]
        if (!el) return
        const offset = STACK_OFFSETS[Math.min(pos, STACK_OFFSETS.length - 1)]!
        gsap.to(el, {
          x: offset.x,
          y: offset.y,
          rotation: offset.rotate,
          duration: SETTLE_DURATION,
          ease: 'power3.out',
        })
      })
    })
  }, [hasStack, populated.length])

  const jumpTo = useCallback(
    (targetImageIdx: number) => {
      if (animatingRef.current || !hasStack) return
      const currentOrder = orderRef.current
      const targetPosition = currentOrder.indexOf(targetImageIdx)
      if (targetPosition <= 0) return // already on top or not found

      animatingRef.current = true

      // Rebuild order so target is at position 0, preserving relative order.
      const newOrder = [
        ...currentOrder.slice(targetPosition),
        ...currentOrder.slice(0, targetPosition),
      ]

      newOrder.forEach((imgIdx, pos) => {
        const el = layerRefs.current[imgIdx]
        if (!el) return
        const offset = STACK_OFFSETS[Math.min(pos, STACK_OFFSETS.length - 1)]!
        gsap.set(el, { zIndex: populated.length - pos })
        gsap.to(el, {
          x: offset.x,
          y: offset.y,
          rotation: offset.rotate,
          duration: SETTLE_DURATION,
          ease: 'power3.out',
          onComplete:
            pos === newOrder.length - 1
              ? () => {
                  animatingRef.current = false
                }
              : undefined,
        })
      })

      setOrder(newOrder)
    },
    [hasStack, populated.length],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasStack) return
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault()
      flip()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      // Go backwards: bring the last card to the front.
      const currentOrder = orderRef.current
      const lastIdx = currentOrder[currentOrder.length - 1]
      if (lastIdx !== undefined) jumpTo(lastIdx)
    }
  }

  if (populated.length === 0) return null

  // Current top image idx, for the live-region announcement.
  const topImageIdx = order[0] ?? 0
  const currentPosition = order.indexOf(topImageIdx) // always 0, but kept for clarity
  const topImageNumber = topImageIdx + 1

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-square focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl',
        hasStack && 'cursor-pointer',
        className,
      )}
      onClick={hasStack ? flip : undefined}
      role={hasStack ? 'button' : undefined}
      aria-label={
        hasStack ? `Image ${topImageNumber} of ${populated.length}. Click to see next.` : undefined
      }
      tabIndex={hasStack ? 0 : undefined}
      onKeyDown={hasStack ? handleKeyDown : undefined}
    >
      {/* One DOM node per image. Position in the stack is driven by transforms,
          not DOM order, so the React tree stays stable. */}
      {populated.map((item, i) => (
        <div
          key={item.id ?? i}
          ref={(el) => {
            layerRefs.current[i] = el
          }}
          className={cn(
            'absolute inset-0 rounded-xl overflow-hidden',
            i === 0 && 'shadow-lg', // initial top gets the shadow; not critical to update
          )}
          aria-hidden={order[0] !== i}
        >
          <Media
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
            resource={item.image}
            priority={i < 2} // preload first two; rest lazy-load fine
          />
        </div>
      ))}

      {/* Dots — current position indicator + jump-to control. */}
      {hasStack && (
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {populated.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => jumpTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={order[0] === i}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-200',
                order[0] === i ? 'bg-primary w-4' : 'bg-primary/30 hover:bg-primary/60',
              )}
            />
          ))}
        </div>
      )}

      {/* Screen-reader announcement of current image */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Image {topImageNumber} of {populated.length}
      </div>
    </div>
  )
}

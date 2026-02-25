import React from 'react'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Gallery } from '@/payload-types'

interface GalleryContentProps {
  heading?: string | null
  headingHighlight?: string | null
  subtitle?: string | null
}

export default async function GalleryContent({
  heading = 'Our Impact.',
  headingHighlight = 'In Pictures.',
  subtitle = 'Some pictures from our projects.',
}: GalleryContentProps) {
  const payload = await getPayload({ config })

  const { docs: galleries } = await payload.find({
    collection: 'gallery',
    limit: 100,
    depth: 2,
    sort: 'order',
  })

  // Flatten all images from all gallery documents
  const allImages = galleries.flatMap((gallery) => gallery.images || [])

  // Distribute images across 3 columns
  const leftImages = allImages.slice(0, 3)
  const middleImages = allImages.slice(3, 5)
  const rightImages = allImages.slice(5)

  return (
    <div className="min-h-screen w-screen relative z-40 bg-gradient-to-b from-base-100 to-base-300 h-max">
      <div className="custom-shape-divider-bottom-1737549060">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="shape-fill scale-x-200 sm:scale-x-100"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>

      <div className="relative h-max flex flex-col items-center py-10 pb-20">
        <div className="text-2xl sm:text-5xl font-semibold py-16 text-center">
          <span className="text-black dark:text-white">{heading} </span>
          <span className="text-primary">{headingHighlight}</span>
          <br />
          <br />
          <div className="text-lg">{subtitle}</div>
        </div>

        <div className="w-[100vw] mx-auto z-10 relative px-4">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 sm:gap-6 relative z-10">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {leftImages.map((img, idx) => (
                <GalleryImageItem key={idx} image={img} aspectRatio="video" />
              ))}
            </div>

            {/* Middle Column */}
            <div className="flex flex-col gap-6">
              {middleImages.map((img, idx) => (
                <GalleryImageItem
                  key={idx}
                  image={img}
                  aspectRatio="middle"
                  index={idx}
                  total={middleImages.length}
                />
              ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {rightImages.map((img, idx) => (
                <GalleryImageItem key={idx} image={img} aspectRatio="video" />
              ))}
            </div>
          </div>
          <div className="max absolute inset-0 flex justify-center items-center z-1 hidden sm:flex">
            <svg
              className="w-full h-auto"
              viewBox="0 0 1440 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1470.6 360C1282.95 360 1282.95 440 1095.3 440C907.65 440 907.65 360 720 360C532.35 360 532.35 440 344.7 440C157.05 440 157.05 360 -30.6 360"
                stroke="#5863ff"
                strokeWidth="80"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M-30.6 120C157.05 120 157.05 200 344.7 200C532.35 200 532.35 120 720 120C907.65 120 908.484 200 1096.13 200C1283.78 200 1282.95 120 1470.6 120"
                stroke="#5863ff"
                strokeWidth="80"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1470.6 600C1282.95 600 1282.95 680 1095.3 680C907.65 680 907.65 600 720 600C532.35 600 532.35 680 344.7 680C157.05 680 157.05 600 -30.6 600"
                stroke="#5863ff"
                strokeWidth="80"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

interface GalleryImageItemProps {
  image: Gallery['images'][0]
  aspectRatio: 'video' | 'middle'
  index?: number
  total?: number
}

function GalleryImageItem({ image, aspectRatio }: GalleryImageItemProps) {
  let imageUrl = '/Falcon.svg'
  let altText = 'Gallery image'

  if (image.image) {
    if (typeof image.image === 'object' && image.image.url) {
      imageUrl = image.image.url
    }
  }

  if (image.alt) {
    altText = typeof image.alt === 'string' ? image.alt : 'Gallery image'
  }

  const containerClass = aspectRatio === 'video' ? 'aspect-video' : 'h-[calc(50%-0.75rem)]'

  return (
    <div className={`${containerClass} rounded-lg relative w-full`}>
      <Image
        alt={altText}
        src={imageUrl}
        height={500}
        width={500}
        className="absolute w-full h-full left-0 top-0 scale-100 mix-blend-overlay dark:mix-blend-normal rounded-lg object-cover"
      />
    </div>
  )
}

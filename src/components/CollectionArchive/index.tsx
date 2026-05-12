import React, { Fragment } from 'react'
import Link from 'next/link'

import { Card, CardImage, CardBody, CardCTA } from '@/components/primitives/card'
import { Media } from '@/components/Media'

import type { Post } from '@/payload-types'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = ({ posts }) => {
  return (
    <div className="container">
      <div className="flex flex-row flex-wrap gap-6 justify-center">
        {posts?.map((post, index) => {
          if (typeof post !== 'object' || post === null) return null

          const { slug, categories, meta, title } = post
          const { description, image: metaImage } = meta || {}
          const href = `/posts/${slug}`

          const hasCategories =
            Array.isArray(categories) && categories.length > 0

          return (
            <Card key={index}>
              {metaImage && typeof metaImage !== 'string' && (
                <CardImage>
                  <Media
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                    resource={metaImage}
                    size="33vw"
                  />
                </CardImage>
              )}

              <CardBody>
                {hasCategories && (
                  <p className="text-xs uppercase text-primary/60 mb-1 tracking-wide">
                    {(categories as NonNullable<typeof categories>).map((category, i) => {
                      if (typeof category !== 'object') return null
                      const isLast = i === (categories as any[]).length - 1
                      return (
                        <Fragment key={i}>
                          {category.title}
                          {!isLast && ', '}
                        </Fragment>
                      )
                    })}
                  </p>
                )}

                {title && (
                  <h3 className="text-lg font-bold text-primary leading-snug">
                    <Link href={href} className="hover:underline">
                      {title}
                    </Link>
                  </h3>
                )}

                {description && (
                  <p className="text-sm text-base-content/70 mt-1 line-clamp-3">
                    {description.replace(/\s/g, ' ')}
                  </p>
                )}
              </CardBody>

              <CardCTA href={href}>Read post</CardCTA>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

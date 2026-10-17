import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { titleFor } from '@/utilities/siteMetadata'
import { data } from '@/data'
import { IS_STATIC_EXPORT } from '@/utilities/buildTarget'
import { requireServerRender } from '@/utilities/dynamicRendering'


type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  await requireServerRender()

  const { pageNumber } = await paramsPromise

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await data.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: titleFor(`Posts${pageNumber ? ` — page ${pageNumber}` : ''}`),
  }
}

export async function generateStaticParams() {
  if (!IS_STATIC_EXPORT) return []

  const { totalDocs } = await data.count({ collection: 'posts' })

  // `output: export` rejects a dynamic route that generates no paths, so page
  // 1 always exists even when the posts collection is empty.
  const totalPages = Math.max(1, Math.ceil(totalDocs / 10))

  return Array.from({ length: totalPages }, (_, i) => ({ pageNumber: String(i + 1) }))
}

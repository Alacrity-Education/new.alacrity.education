import type { Metadata } from 'next/types'

import React, { Suspense } from 'react'

import { Search } from '@/search/Component'
import PageClient from './page.client'
import { SearchResults } from './SearchResults'
import { titleFor } from '@/utilities/siteMetadata'
import { PageTransition } from '@/components/PageTransition'

export default function Page() {
  return (
    <PageTransition>
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {/* useSearchParams needs a Suspense boundary to prerender statically */}
      <Suspense fallback={<div className="container">Loading…</div>}>
        <SearchResults />
      </Suspense>
    </div>
    </PageTransition>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: titleFor('Search'),
    alternates: { canonical: '/search' },
    // Result lists are thin, query-dependent pages; keep them out of the index
    // but let crawlers follow through to the documents they list.
    robots: { index: false, follow: true },
  }
}

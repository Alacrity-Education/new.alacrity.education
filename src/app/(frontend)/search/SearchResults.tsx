'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { CollectionArchive, type CardPostData } from '@/components/CollectionArchive'
import { sdk } from '@/utilities/getPayloadSDK'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; posts: CardPostData[] }

/**
 * Results are fetched in the browser rather than on the server: a static export
 * has no server to read `?q=` on, so the query is only known client-side.
 *
 * This requires the Payload instance to allow this origin in its `cors` config.
 */
export const SearchResults: React.FC = () => {
  const query = useSearchParams().get('q') ?? ''
  const [state, setState] = useState<State>({ status: 'idle' })

  useEffect(() => {
    if (!query) {
      setState({ status: 'idle' })
      return
    }

    let cancelled = false
    setState({ status: 'loading' })

    sdk
      .find({
        collection: 'search',
        depth: 1,
        limit: 12,
        pagination: false,
        select: { title: true, slug: true, categories: true, meta: true },
        where: {
          or: [
            { title: { like: query } },
            { 'meta.description': { like: query } },
            { 'meta.title': { like: query } },
            { slug: { like: query } },
          ],
        },
      })
      .then((result) => {
        if (!cancelled) {
          setState({ status: 'ready', posts: result.docs as CardPostData[] })
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [query])

  if (state.status === 'idle') {
    return <div className="container">Type to search.</div>
  }

  if (state.status === 'loading') {
    return <div className="container">Searching…</div>
  }

  if (state.status === 'error') {
    return <div className="container">Search is unavailable right now.</div>
  }

  if (state.posts.length === 0) {
    return <div className="container">No results found.</div>
  }

  return <CollectionArchive posts={state.posts} />
}

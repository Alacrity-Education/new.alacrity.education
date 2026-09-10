import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { SITE_OG_IMAGE, titleFor } from './siteMetadata'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + SITE_OG_IMAGE

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = titleFor(doc?.meta?.title)

  // Next expects an array; the field is a comma-separated string. Trimmed and
  // de-blanked so "a, b, , c" does not emit an empty keyword.
  const keywords = doc?.meta?.keywords
    ?.split(',')
    .map((k) => k.trim())
    .filter(Boolean)

  return {
    description: doc?.meta?.description,
    keywords: keywords?.length ? keywords : undefined,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}

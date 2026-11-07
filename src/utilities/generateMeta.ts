import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getSiteURL } from './getURL'
import { getPublicMediaUrl } from './getMediaUrl'
import { SITE_OG_IMAGE, titleFor } from './siteMetadata'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  if (image && typeof image === 'object' && 'url' in image) {
    return getPublicMediaUrl(image.sizes?.og?.url || image.url)
  }

  return getSiteURL() + SITE_OG_IMAGE
}

/**
 * Site-relative path of a page or post: `/` for the home page, `/about-us`,
 * `/posts/hello`. Relative on purpose — the root layout's metadataBase (the
 * public site URL) turns it into the absolute canonical and og:url.
 */
export const pathFor = (collection: 'pages' | 'posts', slug?: string | null): string => {
  if (collection === 'posts') return `/posts/${slug ?? ''}`
  return !slug || slug === 'home' ? '/' : `/${slug}`
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  /** Where this document lives on the site; see pathFor. */
  path: string
}): Promise<Metadata> => {
  const { doc, path } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = titleFor(doc?.meta?.title)

  // Next expects an array; the field is a comma-separated string. Trimmed and
  // de-blanked so "a, b, , c" does not emit an empty keyword.
  const keywords = doc?.meta?.keywords
    ?.split(',')
    .map((k) => k.trim())
    .filter(Boolean)

  return {
    alternates: { canonical: path },
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
      url: path,
    }),
    title,
  }
}

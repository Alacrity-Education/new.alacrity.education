import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { SITE_NAME, SITE_OG_IMAGE, SITE_TAGLINE, SITE_TITLE } from './siteMetadata'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: `${SITE_TAGLINE}.`,
  images: [
    {
      url: `${getServerSideURL()}${SITE_OG_IMAGE}`,
    },
  ],
  siteName: SITE_NAME,
  title: SITE_TITLE,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

import type { Footer, Media, Post } from '@/payload-types'

import { getPublicMediaUrl } from './getMediaUrl'
import { getSiteURL } from './getURL'
import { SITE_NAME, SITE_OG_IMAGE } from './siteMetadata'

/**
 * schema.org structured data (JSON-LD) for search engines.
 *
 * The home page carries the Organization and WebSite nodes — the knowledge
 * panel, logo and site name Google shows come from there — and each post
 * carries a BlogPosting that points back at the Organization by @id rather
 * than repeating it.
 */

/** Legal details, as in the privacy policy (clause 1.1). */
export const ORGANIZATION = {
  legalName: 'Asociația Alacrity Education',
  taxID: '51180585',
  email: 'contact@alacrity.ro',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calea Victoriei 142-148, Sc. D, Et. 5, Ap. 24',
    addressLocality: 'București',
    addressRegion: 'Sector 1',
    addressCountry: 'RO',
  },
  /** public/logo.png */
  logo: { path: '/logo.png', width: 366, height: 334 },
} as const

const organizationId = () => `${getSiteURL()}/#organization`
const websiteId = () => `${getSiteURL()}/#website`

export const homeStructuredData = (args: {
  description?: string | null
  socialLinks?: Footer['socialLinks']
}) => {
  const site = getSiteURL()
  const sameAs = (args.socialLinks ?? []).map((l) => l?.url).filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        // NGO is schema.org's Organization subtype for non-governmental
        // organisations; Google reads any Organization subtype.
        '@type': 'NGO',
        '@id': organizationId(),
        name: SITE_NAME,
        legalName: ORGANIZATION.legalName,
        url: `${site}/`,
        logo: {
          '@type': 'ImageObject',
          url: site + ORGANIZATION.logo.path,
          width: ORGANIZATION.logo.width,
          height: ORGANIZATION.logo.height,
        },
        image: site + SITE_OG_IMAGE,
        ...(args.description ? { description: args.description } : {}),
        email: ORGANIZATION.email,
        address: ORGANIZATION.address,
        taxID: ORGANIZATION.taxID,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId(),
        url: `${site}/`,
        name: SITE_NAME,
        inLanguage: 'en',
        publisher: { '@id': organizationId() },
      },
    ],
  }
}

export const postStructuredData = (post: Post, path: string) => {
  const site = getSiteURL()
  const url = site + path

  const imageDoc = [post.meta?.image, post.heroImage].find(
    (i): i is Media => typeof i === 'object' && i !== null,
  )
  // The social-card size first: it is what the export already bundles for
  // og:image, and Google wants an image at least 1200px wide.
  const image = imageDoc ? getPublicMediaUrl(imageDoc.sizes?.og?.url || imageDoc.url) : undefined

  const authors = (post.populatedAuthors ?? [])
    .map((a) => a?.name)
    .filter((n): n is string => Boolean(n))
    .map((name) => ({ '@type': 'Person', name }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    ...(post.meta?.description ? { description: post.meta.description } : {}),
    ...(image ? { image } : {}),
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: authors.length ? authors : { '@id': organizationId() },
    publisher: { '@id': organizationId() },
    inLanguage: 'en',
    isPartOf: { '@id': websiteId() },
  }
}

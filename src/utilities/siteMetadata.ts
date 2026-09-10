/**
 * Site-wide metadata defaults.
 *
 * Kept in one module because the same name previously appeared as a literal in
 * six places — the SEO plugin, the OG defaults, generateMeta and three page
 * titles — which is how they drifted out of sync in the first place.
 */

export const SITE_NAME = 'Alacrity Education'

export const SITE_TAGLINE = 'Chaotic curiosity, rigorous engineering'

/** Used where there is no document of its own to name. */
export const SITE_TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`

/**
 * Social card image, relative to the site root. The navbar mark doubles as the
 * social image; it is square rather than the 1200x630 the platforms prefer, so
 * cards render it small rather than full-bleed.
 */
export const SITE_OG_IMAGE = '/logo.png'

/**
 * Titles a page. A document gets `Its Title | Alacrity Education` rather than
 * the full tagline appended, which would run past what search results show.
 */
export const titleFor = (docTitle?: string | null): string =>
  docTitle ? `${docTitle} | ${SITE_NAME}` : SITE_TITLE

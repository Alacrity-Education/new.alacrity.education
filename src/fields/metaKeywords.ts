import type { Field } from 'payload'

/**
 * `keywords` for the SEO group.
 *
 * A single comma-separated text field rather than an array: that is the shape
 * the `<meta name="keywords">` tag wants, it is what editors are used to typing,
 * and it stays one varchar column instead of a join table per collection.
 *
 * Declared here so Pages and Posts share one definition and cannot drift.
 */
export const metaKeywords: Field = {
  name: 'keywords',
  type: 'text',
  label: 'Keywords',
  admin: {
    description:
      'Comma separated, e.g. "robotics, student lab, Bucharest". Search engines largely ignore this tag, so treat it as a hint rather than a ranking lever.',
  },
}

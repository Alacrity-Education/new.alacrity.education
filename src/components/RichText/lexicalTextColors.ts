/**
 * Text colours of the Lexical text-state feature, copied from
 * @payloadcms/richtext-lexical 3.88.0 (defaultColors.text).
 *
 * Copied rather than imported: the package only exports them from its `/client`
 * entry, which is the whole editor plus Payload's admin UI — importing it here
 * put ~800 KB of editor code on every public page. Plain data, so a copy is safe.
 */
export const lexicalTextColors = {
  'text-red': {
    css: {
      color: 'light-dark(oklch(0.577 0.245 27.325), oklch(0.704 0.191 22.216))',
    },
    label: 'Red',
  },
  'text-orange': {
    css: {
      color: 'light-dark(oklch(0.646 0.222 41.116), oklch(0.75 0.183 55.934))',
    },
    label: 'Orange',
  },
  'text-yellow': {
    css: {
      color: 'light-dark(oklch(0.554 0.135 66.442), oklch(0.905 0.182 98.111))',
    },
    label: 'Yellow',
  },
  'text-green': {
    css: {
      color: 'light-dark(oklch(0.527 0.154 150.069), oklch(0.792 0.209 151.711))',
    },
    label: 'Green',
  },
  'text-blue': {
    css: {
      color: 'light-dark(oklch(0.546 0.245 262.881), oklch(0.707 0.165 254.624))',
    },
    label: 'Blue',
  },
  'text-purple': {
    css: {
      color: 'light-dark(oklch(0.558 0.288 302.321), oklch(0.714 0.203 305.504))',
    },
    label: 'Purple',
  },
  'text-pink': {
    css: {
      color: 'light-dark(oklch(0.592 0.249 0.584), oklch(0.718 0.202 349.761))',
    },
    label: 'Pink',
  },
} as const

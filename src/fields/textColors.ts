/**
 * The colours an editor can apply to a run of text in the content block.
 *
 * The class is the real treatment — the page renders from this map, and both
 * entries need more than a colour declaration: one has to beat the prose
 * styles around it, the other carries a gradient, a selection fix and a
 * fallback.
 */
export const textColorClasses = {
  primary: 'mark-primary',
  gradient: 'mark-highlight',
} as const

export type TextColor = keyof typeof textColorClasses

/**
 * The same choices as TextStateFeature wants them: a label for the picker and
 * CSS to paint the run inside the editor. Hyphenated, not React's camelCase —
 * Payload types this as csstype's hyphenated properties.
 *
 * The gradient here only approximates `.mark-highlight`; it is enough for an
 * editor to see what the choice does while writing.
 */
export const textColorStates: Record<TextColor, { label: string; css: Record<string, string> }> = {
  primary: {
    label: 'Primary',
    css: { color: 'var(--color-primary)' },
  },
  gradient: {
    label: 'Gradient',
    css: {
      'background-image':
        'linear-gradient(100deg, var(--color-brand-700), var(--color-brand-500) 50%, var(--color-brand-700))',
      '-webkit-background-clip': 'text',
      'background-clip': 'text',
      color: 'transparent',
    },
  },
}

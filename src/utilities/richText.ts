type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
}

/** Leaves that occupy no visible space of their own. */
const BLANK_LEAVES = new Set(['linebreak', 'tab'])

/**
 * Deliberately defaults to "yes". A node carrying neither text nor children
 * renders itself — an upload, a horizontal rule, an embedded block — and the
 * failure mode of guessing wrong in that direction is a stray empty wrapper,
 * versus silently hiding real content if it defaulted the other way.
 */
const nodeHasContent = (node: LexicalNode | null | undefined): boolean => {
  if (!node || typeof node !== 'object') return false
  if (typeof node.text === 'string') return node.text.trim() !== ''
  if (node.type && BLANK_LEAVES.has(node.type)) return false
  if (Array.isArray(node.children)) return node.children.some(nodeHasContent)
  return true
}

/**
 * Whether a Lexical field would actually render anything.
 *
 * A cleared rich text field is NOT null — Lexical persists it as a populated
 * object (a root holding one empty paragraph), so `data && <Wrapper/>` is always
 * true and any wrapper behind it renders as a blank, padded box. Walking the
 * tree for real content is the only way to tell the two apart.
 *
 * Whitespace-only text counts as empty, since it renders as nothing.
 *
 * Declared as a type predicate so it narrows exactly like the `data && …` check
 * it replaces — without `data is T`, callers lose the non-null narrowing and
 * every `data={richText}` below one of these guards stops type-checking.
 */
export function hasRichTextContent<T>(data: T | null | undefined): data is T {
  const children = (data as { root?: { children?: LexicalNode[] } } | null | undefined)?.root
    ?.children
  return Array.isArray(children) && children.some(nodeHasContent)
}

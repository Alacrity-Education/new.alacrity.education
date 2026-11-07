import React from 'react'

/**
 * Renders schema.org structured data as a JSON-LD script.
 *
 * `<` is escaped so a value containing `</script>` cannot close the tag early;
 * JSON parsers read `<` back as `<`.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

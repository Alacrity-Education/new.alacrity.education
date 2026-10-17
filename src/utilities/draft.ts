import { draftMode } from 'next/headers'

import { IS_STATIC_EXPORT } from '@/utilities/buildTarget'

/**
 * Whether the reader is in Payload's draft preview.
 *
 * Always false in the static build: preview needs a server to set the cookie
 * and to render on demand, and an export has neither. The check is written so
 * `draftMode()` is never reached there — it is a dynamic API, and calling one
 * makes a route unexportable. NEXT_PUBLIC_BUILD_TARGET is inlined at build
 * time, so webpack drops the dead branch rather than leaving the call in.
 */
export const isDraftEnabled = async (): Promise<boolean> => {
  if (IS_STATIC_EXPORT) return false

  const { isEnabled } = await draftMode()
  return isEnabled
}

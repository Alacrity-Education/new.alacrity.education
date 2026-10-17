import type { Config } from '@/payload-types'

import { PayloadSDK } from '@payloadcms/sdk'
import { getClientSideURL } from '@/utilities/getURL'

/**
 * Base URL of the Payload REST API.
 *
 * Set NEXT_PUBLIC_PAYLOAD_API_URL when the CMS lives somewhere else — that is
 * the static build's normal case, and the whole reason this file exists. Left
 * unset it falls back to this site's own `/api`, which is what the server
 * build serves, so client components can use this module in either build.
 */
const baseURL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || `${getClientSideURL()}/api`

/**
 * Payload over REST.
 *
 * Read access is anonymous here — there is no `overrideAccess` to reach for —
 * so every collection the frontend queries has to be readable by the public.
 */
export const data = new PayloadSDK<Config>({ baseURL })

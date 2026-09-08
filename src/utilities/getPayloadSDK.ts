import type { Config } from '@/payload-types'

import { PayloadSDK } from '@payloadcms/sdk'

const baseURL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL

if (!baseURL) {
  throw new Error('NEXT_PUBLIC_PAYLOAD_API_URL is not set')
}

/**
 * Shared remote Payload client for the frontend.
 *
 * The frontend reads through the REST API rather than the Local API, so access
 * control always applies — there is no `overrideAccess` escape hatch. Every
 * collection the frontend queries must therefore be readable anonymously.
 */
export const sdk = new PayloadSDK<Config>({ baseURL })

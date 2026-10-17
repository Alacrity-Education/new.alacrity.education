import type { Config } from '@/payload-types'
import type { PayloadSDK } from '@payloadcms/sdk'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Client = PayloadSDK<Config>

/**
 * Access control, which the two clients reach by opposite routes.
 *
 * REST always enforces it: anonymous reads see published documents and nothing
 * else. The Local API does the reverse — it bypasses access control unless
 * told not to, so calling it plainly would serve every draft from the server
 * build. So `overrideAccess` is pinned to the one case that needs it: draft
 * preview, where reading an unpublished document is the whole point. Anywhere
 * else the two clients return the same documents, which is what lets a call
 * site stay ignorant of which one it has.
 */
const withAccess = (args: { draft?: boolean }) =>
  ({ ...args, overrideAccess: args?.draft === true }) as never

/**
 * Payload over the Local API.
 *
 * Same surface as the remote client, so call sites import `@/data` and never
 * learn which one they got.
 *
 * The arguments are untyped inside and the object is typed once on the way
 * out. Both clients describe the same operations, but with types from
 * different packages, and threading the SDK's generics through each wrapper
 * made TypeScript give up ("union type that is too complex to represent").
 * Call sites are unaffected: they see `Client`, so a call that type-checks
 * against REST is the only kind that compiles.
 */
export const data = {
  find: async (args: never) => (await getPayload({ config: configPromise })).find(withAccess(args)),

  findByID: async (args: never) =>
    (await getPayload({ config: configPromise })).findByID(withAccess(args)),

  findGlobal: async (args: never) =>
    (await getPayload({ config: configPromise })).findGlobal(withAccess(args)),

  count: async (args: never) =>
    (await getPayload({ config: configPromise })).count(withAccess(args)),
} as unknown as Client

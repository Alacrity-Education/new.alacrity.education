import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { timingSafeEqual } from 'node:crypto'
import { headers } from 'next/headers'

/**
 * Deletes form submissions older than the period Section 8 of the privacy
 * policy states (docs/privacy-policy.md). Payload expires nothing on its own,
 * so without this the policy would be describing something that never happens.
 *
 * Called once a day by the cron on the VM — see ops/retention/purge-expired.sh,
 * which also handles Umami's data. A route rather than a scheduled Payload job:
 * putting a `schedule` on a task adds the payload-jobs-stats global, which is a
 * migration in production for what is one delete a day.
 *
 * Lives under next/, which the static build deletes, so it only exists on the
 * server that holds the submissions.
 */
const RETENTION_YEARS = 3

export const maxDuration = 60

/** Fails closed: with no CRON_SECRET configured, nothing can call this. */
const isAuthorised = (authHeader: string | null): boolean => {
  const secret = process.env.CRON_SECRET
  if (!secret || !authHeader) return false

  const expected = Buffer.from(`Bearer ${secret}`)
  const given = Buffer.from(authHeader)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export async function POST(request: Request): Promise<Response> {
  // Checked before Payload initialises, so an unauthenticated call costs nothing.
  const requestHeaders = await headers()
  if (!isAuthorised(requestHeaders.get('authorization'))) {
    return new Response('Action forbidden.', { status: 403 })
  }

  const payload = await getPayload({ config })
  const dryRun = new URL(request.url).searchParams.get('dryRun') === '1'

  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - RETENTION_YEARS)
  const where = { createdAt: { less_than: cutoff.toISOString() } }

  try {
    if (dryRun) {
      const { totalDocs } = await payload.count({ collection: 'form-submissions', where })
      return Response.json({ dryRun: true, wouldDelete: totalDocs, cutoff })
    }

    // No user: this is an administrative operation by design, so access
    // control is bypassed deliberately rather than by default.
    const req = await createLocalReq({}, payload)
    const { docs, errors } = await payload.delete({
      collection: 'form-submissions',
      where,
      overrideAccess: true,
      req,
    })

    if (errors.length) {
      payload.logger.error({ errors, message: 'Some expired form submissions failed to delete' })
    }

    return Response.json({ deleted: docs.length, failed: errors.length, cutoff })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error purging expired form submissions' })
    return new Response('Error purging expired form submissions.', { status: 500 })
  }
}

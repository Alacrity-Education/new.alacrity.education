/**
 * Which of the two builds this is.
 *
 * One codebase ships twice:
 *
 *   server  — `next build` with `output: 'standalone'`. Payload's admin, its
 *             REST/GraphQL routes and the frontend, all in one container,
 *             reading the database through the Local API.
 *
 *   static  — `next build` with `output: 'export'` and BUILD_TARGET=static.
 *             The frontend only, prerendered to HTML at build time against a
 *             remote Payload's REST API, with no database of its own. The
 *             workflow deletes the server-only route groups before building.
 *
 * NEXT_PUBLIC_ so the value is inlined into client bundles too, and so route
 * segment config that reads it resolves at build time rather than at runtime.
 */
export const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_BUILD_TARGET === 'static'

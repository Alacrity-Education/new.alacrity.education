/**
 * The frontend's one way to read content.
 *
 * This re-exports the Local API client. The static build swaps it for the REST
 * one through a webpack alias in next.config.js — `./local` resolves to
 * `./remote` when BUILD_TARGET=static — rather than by branching at runtime,
 * because a runtime check would still bundle `payload`, `pg` and `sharp` into
 * an export build that has no database to talk to and cannot compile them.
 *
 * So: import from `@/data`, never from `@/data/local` or `@/data/remote`.
 */
export { data } from './local'

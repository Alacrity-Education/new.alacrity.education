/**
 * The frontend's one way to read content.
 *
 * This is the server build's client: Payload's Local API. The static build
 * does not import it — its workflow copies index.static.ts over this file
 * before building, so `@/data` resolves to the REST client instead and the
 * export never pulls in payload, pg or sharp, none of which it can compile or
 * has a database for.
 *
 * So: import from `@/data`, never from `@/data/local` or `@/data/remote` —
 * except in a client component, which always wants `@/data/remote`, because
 * this file is the Local API in the browser's bundle too.
 */
export { data } from './local'

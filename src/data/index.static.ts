/**
 * The static build's data client, copied over index.ts by the workflow.
 *
 * Not chosen by a bundler alias: next.config.js's `webpack` hook is ignored
 * under Turbopack, which both builds use, so an alias there resolved to the
 * Local API anyway and the export went looking for a database. A file the
 * workflow copies cannot be silently skipped — and it is the same move the
 * build already makes for the route groups it deletes.
 */
export { data } from './remote'

import path from 'path'
import { fileURLToPath } from 'url'

import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * One codebase, two builds. See src/utilities/buildTarget.ts for what each is.
 *
 * Everything below that reads this flag is build plumbing, not site behaviour:
 * where the output goes, which data client is bundled, and which Next features
 * an export can have.
 */
const isStatic = process.env.NEXT_PUBLIC_BUILD_TARGET === 'static'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone emits .next/standalone, which the Dockerfile copies into the
  // runtime image. export writes plain HTML to out/ for Cloudflare Pages.
  output: isStatic ? 'export' : 'standalone',
  images: {
    // No image optimiser in an export — there is no server to run one.
    ...(isStatic ? { unoptimized: true } : {}),
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      // filter(Boolean) so an unset var is skipped rather than throwing
      // "Invalid URL" out of new URL(undefined) and failing the whole build.
      ...[
        process.env.NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */,
        // The static build reads from a remote Payload, which serves its media
        // from its own origin.
        process.env.NEXT_PUBLIC_PAYLOAD_API_URL,
      ]
        .filter(Boolean)
        .map((item) => {
          const url = new URL(item)

          return {
            hostname: url.hostname,
            protocol: url.protocol.replace(':', ''),
          }
        }),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/file/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ark.tail5ef469.ts.net',
        // Omit the port entirely so it matches the default empty string
        pathname: '/**', // Simplified wildcard to catch all paths safely
      },
    ],
  },
  allowedDevOrigins: ['ark.tail5ef469.ts.net'],
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // The data client is chosen here rather than by an `if` inside src/data,
    // because a runtime branch still bundles both arms — and the Local API arm
    // drags in payload, pg and sharp, none of which an export can compile or
    // has a database for. Aliasing means the export never sees that module.
    if (isStatic) {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        [path.resolve(dirname, 'src/data/local')]: path.resolve(dirname, 'src/data/remote.ts'),
      }
    }

    return webpackConfig
  },
  reactStrictMode: true,
  // Next cannot serve redirects from an export; Cloudflare Pages does it with
  // its own _redirects file instead.
  ...(isStatic ? {} : { redirects }),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

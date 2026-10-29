import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

/**
 * One codebase, two builds. See src/utilities/buildTarget.ts for what each is.
 *
 * Everything below that reads this flag is build plumbing, not site behaviour:
 * where the output goes and which Next features an export can have. Which data
 * client gets bundled is NOT decided here — the `webpack` hook below is
 * ignored under Turbopack, which both builds use, so the workflow copies
 * src/data/index.static.ts into place instead.
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

    return webpackConfig
  },
  reactStrictMode: true,
  experimental: {
    // Hooks route navigations into React's <ViewTransition>, which is how pages
    // lift in. See src/components/PageTransition and the view-transition rules
    // in globals.css. Without browser support navigation simply isn't animated.
    viewTransition: true,
  },
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

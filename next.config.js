import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      ...[
        process.env.NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */,
        // The frontend may read from a remote Payload instance, which serves
        // media from its own origin.
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
  redirects,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

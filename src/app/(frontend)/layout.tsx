import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { CardMorph } from '@/components/PageTransition/CardMorph'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Lexend, Lexend_Deca } from 'next/font/google'
import { IS_STATIC_EXPORT } from '@/utilities/buildTarget'
import { isDraftEnabled } from '@/utilities/draft'

const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend', display: 'swap' })
const lexendDeca = Lexend_Deca({ subsets: ['latin'], variable: '--font-lexend-deca', display: 'swap' })
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { SITE_TAGLINE, SITE_TITLE } from '@/utilities/siteMetadata'

/**
 * Rendered on demand rather than prerendered at build.
 *
 * Every page here reads from Payload, so prerendering meant the image build
 * needed a live database — which in turn meant giving CI a route into it. The
 * data itself is still cached: getCachedGlobal/getCachedDocument/getRedirects
 * wrap their queries in unstable_cache with tags, and the collection
 * afterChange hooks call revalidateTag on publish, so a request only reaches
 * Postgres when the cache for that tag has actually been busted.
 *
 * THE STATIC BUILD DELETES THE LINE BELOW. It has to: `output: export` rejects
 * force-dynamic outright. And it has to be deleted rather than switched on a
 * flag, because Next parses route segment config out of the source and accepts
 * nothing but a literal here.
 *
 * It cannot be pushed down into the pages either. Next prerenders /_not-found
 * whatever that route says — force-dynamic on it does nothing — so the only
 * thing keeping that prerender off the database is this layout being dynamic.
 */
export const dynamic = 'force-dynamic'
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Always false in the static build, where there is no server to preview from
  // and nothing for the admin bar to link back to.
  const isEnabled = await isDraftEnabled()

  return (
    <html className={`${lexend.variable} ${lexendDeca.variable}`} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          {!IS_STATIC_EXPORT && (
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
          )}

          <CardMorph />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  title: SITE_TITLE,
  description: `${SITE_TAGLINE}.`,
  twitter: {
    card: 'summary_large_image',
  },
}

import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Lexend, Lexend_Deca } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend', display: 'swap' })
const lexendDeca = Lexend_Deca({ subsets: ['latin'], variable: '--font-lexend-deca', display: 'swap' })
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { SITE_TAGLINE, SITE_TITLE } from '@/utilities/siteMetadata'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={`${lexend.variable} ${lexendDeca.variable}`} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

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

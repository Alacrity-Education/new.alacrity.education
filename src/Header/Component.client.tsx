'use client'

import Link from 'next/link'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav, HighlightBanner, HighlightButton, MobileHeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  // Named so a page transition leaves the header in place: it stays above the
  // content lifting in beneath it rather than being part of that content. See
  // ::view-transition-group(site-header) in globals.css.
  return (
    <nav className="fixed top-0 z-50 flex flex-col" style={{ viewTransitionName: 'site-header' }}>
      {/*<HighlightBanner highlightBanner={data.highlightBanner} />*/}
      <div className="navbar z-10 absolute top-0 inset-x-0 flex flex-row h-max items-center py-2 px-4 lg:px-8 w-screen ">


        <div className="navbar-start h-max">
          <Link href="/" className=" h-max text-primary md:text-xl">
            <Logo loading="eager" priority="high"  />
          </Link>
        </div>
        <MobileHeaderNav data={data} highlightButton={data.highlightButton} />
        <HeaderNav data={data} />

        <HighlightButton highlightButton={data.highlightButton} />

      </div>
      {/* h-23, not h-22: the white band is `grow` inside this fixed height, so
          a unit here is a unit of white under the navbar. It replaces the pt-1
          that used to sit on the nav itself — that padded the whole column
          down, moving the logo and links with it, rather than giving them more
          room to sit in. */}
      <div className='flex flex-col h-23 relative z-0'>
        <div className='bg-base-100 grow'></div>
      <div className="progressive-blur-container h-8 w-screen relative z-0   rotate-180 ">
        <div className="blur-filter opacity-80"></div>
        <div className="blur-filter opacity-80"></div>
        <div className="blur-filter opacity-80"></div>
        <div className="blur-filter opacity-80"></div>
        <div className="blur-filter opacity-80"></div>
        <div className="blur-filter opacity-80"></div>
        <div className="blur-filter opacity-80"></div>
        <div className='absolute inset-0 bg-linear-to-t from-base-100 to-transparent/50 z-10'></div>
        </div>
      </div>
    </nav>
  )
}

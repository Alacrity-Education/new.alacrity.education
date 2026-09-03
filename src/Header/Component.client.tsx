'use client'

import Link from 'next/link'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav, HighlightBanner, HighlightButton, MobileHeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  return (
    <nav className="fixed top-0 z-50 flex flex-col">
      {/*<HighlightBanner highlightBanner={data.highlightBanner} />*/}
      <div className="navbar z-10 absolute top-0 inset-x-0 flex flex-row h-max items-center py-2 lg:px-8 w-screen ">

        <MobileHeaderNav data={data} />
        <div className="navbar-start h-max">
          <Link href="/" className=" h-max text-primary md:text-xl">
            <Logo loading="eager" priority="high"  />
          </Link>
        </div>

        <HeaderNav data={data} />

        <HighlightButton highlightButton={data.highlightButton} />

      </div>
      <div className='flex flex-col h-22 relative z-0'>
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

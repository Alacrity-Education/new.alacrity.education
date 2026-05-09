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
    <nav className=" bg-primary shadow-sm fixed top-0 z-50 flex flex-col">
      <HighlightBanner highlightBanner={data.highlightBanner} />
      <div className="navbar flex flex-row items-center bg-primary lg:px-8 w-screen ">
        <MobileHeaderNav data={data} />
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-primary-content hover:text-primary md:text-xl">
            <Logo loading="eager" priority="high"  />
          </Link>
        </div>

        <HeaderNav data={data} />

        <HighlightButton highlightButton={data.highlightButton} />

      </div>
    </nav>
  )
}

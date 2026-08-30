'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav, HighlightBanner, HighlightButton, MobileHeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const navRef = useRef<HTMLElement>(null)

  /**
   * The desktop dropdown panel is `position: fixed` so it can centre on the
   * viewport, which means it can't derive its offset from the header via
   * `top-full`. Publish the measured header height instead — it changes when
   * the highlight banner is dismissed or the header wraps.
   */
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        '--header-h',
        `${entry.target.getBoundingClientRect().height}px`,
      )
    })

    observer.observe(nav)
    return () => observer.disconnect()
  }, [])

  return (
    <nav ref={navRef} className=" bg-base-100 backdrop-blur-sm fixed top-0 z-50 flex flex-col">
      {/*<HighlightBanner highlightBanner={data.highlightBanner} />*/}
      <div className="navbar flex flex-row items-center lg:px-8 w-screen ">

        <MobileHeaderNav data={data} />
        <div className="navbar-start">
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

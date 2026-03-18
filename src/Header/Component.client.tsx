'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()


  return (
    <header className="navbar bg-base-100 dark:bg-base-300 shadow-sm fixed top-0 z-50">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-base md:text-xl">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>
      </div>
      <HeaderNav data={data} />
    </header>
  )
}

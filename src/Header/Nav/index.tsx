'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MenuIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-3">
      {/* Desktop nav with submenu support */}
      {navItems.map((item, i) => {
        const { itemType, link, subItems } = item as any
        if (itemType === 'parent') {
          return (
            <div key={i} className="hidden lg:block">
              <details className="dropdown dropdown-end">
                <summary className="btn btn-ghost text-sm">
                  {link?.label || 'Menu'}
                </summary>
                <ul className="menu dropdown-content rounded-box bg-base-100 z-10 mt-3 w-52 p-1 shadow-sm">
                  {(subItems || []).map((sub: any, idx: number) => (
                    <li key={idx}>
                      <CMSLink {...sub.link} appearance="inline" className={'invert text-sm'} />
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )
        }
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="btn btn-ghost bg-neutral/20 text-white hidden lg:inline-flex text-sm "
          />
        )
      })}

      {/* Mobile menu */}
      <details className="dropdown dropdown-end lg:hidden">
        <summary className="btn btn-ghost  m-1">
          <MenuIcon className="h-full" />
        </summary>
        <ul className="menu dropdown-content rounded-box z-1 mt-3 w-52 p-1 shadow-sm ">
          {navItems.map((item, i) => {
            const { itemType, link, subItems } = item as any
            if (itemType === 'parent') {
              return (
                <li key={i}>
                  <details>
                    <summary className={'text-base-content'}>{link?.label || 'Menu'}</summary>
                    <ul className="rounded-t-none p-2">
                      {(subItems || []).map((sub: any, idx: number) => (
                        <li key={idx}>
                          <CMSLink {...sub.link} appearance="inline" className={'invert text-sm'} />
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              )
            }
            return (
              <li key={i}>
                <CMSLink {...link} appearance={'inline'} className={'invert text-sm'} />
              </li>
            )
          })}
        </ul>
      </details>
    </nav>
  )
}

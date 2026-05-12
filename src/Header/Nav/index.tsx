'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MenuIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { LinkAppearanceVariants } from '@/fields/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { IoIosClose } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems

  if (!navItems) {
    return null
  }
  return (
    <div className={''}>
      {/* Desktop nav with submenu support */}
      <ul className="menu menu-horizontal lg:flex flex-row px-1 hidden gap-3">
        {navItems.map((item, i) => {
          const { itemType, link, subItems } = item
          if (itemType === 'parent') {
            const {appearance} = item
            return (
              <li key={i} className="h-max w-max overflow-visible">
                <details className="dropdown-end overflow-visible">
                  <Button asChild variant={appearance} className={"overflow-visible"}>
                    <summary className="h-max overflow-visible rounded-md">{link?.label || 'Menu'}</summary>
                  </Button>
                  <ul className="menu dropdown-content rounded-xl rounded-box shadow-2xl bg-base-100 z-80 w-52 p-2 gap-2">
                    {(subItems || []).map((sub: any, idx: number) => (
                      <li
                        className={'hover:bg-primary-content hover:text-primary w-full rounded-md'}
                        key={idx}
                      >
                        <CMSLink {...sub.link} className={'text-start!'} />
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            )
          }
          return (
            <li key={i}>
              <CMSLink {...link} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const MobileHeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems
  if (!navItems) {
    return null
  }

  return (
    <div className={'flex-none lg:hidden'}>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn"
        onClick={() => {
          //@ts-ignore
          document.getElementById('my_modal_5').showModal()
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {' '}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />{' '}
        </svg>
      </button>
      <dialog id="my_modal_5" className="modal transition-none">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box p-2 bg-primary   absolute top-0 left-0 h-max max-h-screen min-h-screen overflow-y-auto overflow-x-clip w-screen sm:w-80 max-w-screen">
          <div className="fixed top-5 right-0 w-full px-5">
            <form method="dialog" className={'flex flex-row w-full items-center'}>
              {/* if there is a button in form, it will close the modal */}
              <div className={'text-primary-content text-2xl'}>Navigation</div>
              <div className={'grow'}></div>
              <button className="text-3xl text-primary-content">
                <IoClose />
              </button>
            </form>
          </div>

          <ul className="menu w-full h-full pt-14">
            {navItems.map((item, i) => {
              const { itemType, link, subItems } = item as any
              if (itemType === 'parent') {
                return (
                  <li key={i}>
                    <details>
                      <summary className={'text-lg text-primary-content'}>
                        {link?.label || 'Menu'}
                      </summary>
                      <ul className="rounded-t-none p-2 dropdown-start">
                        {(subItems || []).map((sub: any, idx: number) => (
                          <li key={idx}>
                            <CMSLink
                              {...sub.link}
                              appearance={'inline'}
                              className={'text-lg text-primary-content'}
                            />
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                )
              }
              return (
                <li key={i}>
          -         <CMSLink
                    {...link}
                    appearance={'inline'}
                    className={'text-start text-lg text-primary-content'}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </dialog>
    </div>
  )
}

/*

 */

type HighlightButtonType = HeaderType['highlightButton']
export const HighlightButton = ({ highlightButton }: { highlightButton: HighlightButtonType }) => {
  if (!highlightButton) {
    return null
  }
  return <CMSLink className={'lg:ml-10 overflow-visible font-bold '}  {...highlightButton.link} />
}

type HighlightBannerType = HeaderType['highlightBanner']
export const HighlightBanner: React.FC<{ highlightBanner: HighlightBannerType }> = ({
  highlightBanner,
}) => {
  const [open, setOpen] = useState(true)

  if (!highlightBanner) {
    return null
  }
  if (!highlightBanner.bannerText) {
    return null
  }

  if (open)
    return (
      <div
        className={
          'text-sm relative flex flex-row justify-center lg:text-sm py-1 font-semibold bg-primary-content text-primary text-center w-screen h-max'
        }
      >
        <RichText data={highlightBanner.bannerText} className={'px-3'} />

        <div
          onClick={() => {
            setOpen(!open)
          }}
          className={
            'absolute text-xl cursor-pointer active:bg-primary hover:bg-primary right-4 z-50 '
          }
        >
          <IoIosClose />
        </div>
      </div>
    )
}

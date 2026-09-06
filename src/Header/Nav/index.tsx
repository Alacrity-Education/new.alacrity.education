'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink, resolveLinkHref } from '@/components/Link'
import { buttonVariants } from '@/components/ui/button'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { IoIosClose } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu'

type NavItem = NonNullable<HeaderType['navItems']>[number]
type NavColumn = NonNullable<NavItem['columns']>[number]
type NavColumnLink = NonNullable<NavColumn['links']>[number]

/**
 * The dropdown panel is one fixed size for every parent item — ~42rem wide,
 * centred on the trigger row just beneath it — so switching between menus
 * never shifts the panel sideways.
 */
const PANEL_WIDTH = 'w-[42rem] max-w-[calc(100vw-2rem)]'

/**
 * Every item occupies the same block so rows line up across both columns, and
 * no single item can stretch the panel: a fixed floor, a hard ceiling, and a
 * two-line clamp on the paragraph.
 */
const ITEM_BOX = 'min-h-[3.5rem] max-h-[5.25rem] overflow-hidden px-2.5 py-2'

/**
 * Item typography is pinned here rather than left to `prose`, whose 1.7 leading
 * and 1.5rem h2 flatten the hierarchy at this size. Title 15px / 1.2, paragraph
 * 12px / 1.35 — a one-step gap doesn't read as a hierarchy, 15 against 12 does.
 */
const itemTypography = (tone: 'panel' | 'sidebar') =>
  cn(
    '[&_h2]:m-0 [&_h2]:text-[0.9375rem] [&_h2]:leading-[1.2] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em]',
    '[&_h3]:m-0 [&_h3]:text-[0.875rem] [&_h3]:leading-[1.2] [&_h3]:font-semibold',
    '[&_h4]:m-0 [&_h4]:text-[0.8125rem] [&_h4]:leading-[1.2] [&_h4]:font-semibold',
    '[&_p]:mt-1 [&_p]:mb-0 [&_p]:line-clamp-2 [&_p]:text-[0.75rem] [&_p]:leading-[1.35]',
    '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
    tone === 'panel'
      ? '[&_h2]:text-base-content [&_h3]:text-base-content [&_h4]:text-base-content [&_p]:text-ink-muted'
      : '[&_h2]:text-primary-content [&_h3]:text-primary-content [&_h4]:text-primary-content [&_p]:text-primary-content/70',
  )

const columnsOf = (item: NavItem): NavColumn[] =>
  (item.columns || []).filter((column) => (column?.links || []).length > 0)

// ---------------------------------------------------------------------------
// Desktop
// ---------------------------------------------------------------------------

const DropdownItem: React.FC<{ item: NavColumnLink }> = ({ item }) => {
  const { link, content } = item
  const href = link && resolveLinkHref(link)

  if (!href) return null

  const newTabProps = link?.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href} className={ITEM_BOX} {...newTabProps}>
          <RichText
            data={content}
            enableGutter={false}
            enableProse={false}
            className={cn('max-w-none', itemTypography('panel'))}
          />
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

const DropdownPanel: React.FC<{ columns: NavColumn[] }> = ({ columns }) => {
  // If any column is titled, the untitled ones still reserve the heading's
  // height so their items start on the same line across the panel. A plain
  // " " collapses to a zero-height box — it has to be a non-breaking space.
  // If no column is titled, nothing is reserved and the panel keeps its own
  // top padding.
  const hasHeadings = columns.some((column) => column.heading)

  return (
    <div
      className={cn(
        'grid max-h-[70vh] gap-x-4 gap-y-3 overflow-y-auto p-4',
        PANEL_WIDTH,
        columns.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
      )}
    >
      {columns.map((column, i) => (
        <div key={i} className="flex flex-col">
          {hasHeadings && (
            <div
              aria-hidden={!column.heading}
              className="px-2.5 pb-1.5 text-[0.6875rem] leading-none font-semibold tracking-[0.1em] text-ink-muted"
            >
              {column.heading || '\u00A0'}
            </div>
          )}
          <ul className="flex flex-col gap-0.5">
            {(column.links || []).map((subItem, idx) => (
              <DropdownItem key={idx} item={subItem} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems

  if (!navItems?.length) {
    return null
  }

  return (
    <div className="navbar-center hidden lg:flex">
      <NavigationMenu
        // Anchored to the trigger row, not to the header: the wrapper's default
        // `absolute top-full` measures from the bottom of the menu root, which
        // hugs the button list. A `fixed` panel would have to be told where the
        // buttons are, and the only number available was the whole nav's height
        // — which includes the blur strip below the bar, so the panel hung well
        // clear of the buttons.
        //
        // Centred on the list rather than each trigger, so switching between
        // menus never shifts the panel sideways.
        viewportClassName={cn('mt-3', PANEL_WIDTH)}
        viewportWrapperClassName="absolute top-full left-1/2 -translate-x-1/2"
      >
        <NavigationMenuList className="gap-3">
          {navItems.map((item, i) => {
            if (item.itemType === 'parent') {
              const columns = columnsOf(item)

              if (!columns.length) return null

              return (
                <NavigationMenuItem key={i}>
                  <NavigationMenuTrigger
                    className={cn(
                      buttonVariants({ variant: item.appearance || 'default' }),
                      'gap-1',
                    )}
                  >
                    {item.label || 'Menu'}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownPanel columns={columns} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            }

            return (
              <NavigationMenuItem key={i}>
                <CMSLink {...item.link} />
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>

    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile — unchanged sidebar behaviour, columns flattened into one stack
// ---------------------------------------------------------------------------

const MOBILE_DIALOG_ID = 'header-mobile-nav'
export const MobileHeaderNav: React.FC<{ data: HeaderType, highlightButton?: HighlightButtonType }> = ({ data, highlightButton }) => {
  const navItems = data?.navItems

  if (!navItems?.length) {
    return null
  }

  return (
    <div className={'navbar-end lg:hidden'}>
      <button
        className="btn btn-primary rounded-md"
        aria-label="Open navigation"
        onClick={() => {
          const dialog = document.getElementById(MOBILE_DIALOG_ID) as HTMLDialogElement | null
          dialog?.showModal()
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </button>
      {/* modal-start makes this a left-edge drawer: daisyUI parks the box at
          translate:-100% and its own [open] rule animates it to 0 over 300ms,
          which replaces the default scale-and-fade. `transition-none` is gone
          on purpose — it sat on .modal and killed the `visibility .3s
          allow-discrete` transition, so the drawer slid IN but vanished
          instantly on close instead of sliding back out. */}
      <dialog id={MOBILE_DIALOG_ID} className="modal modal-start">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box rounded-none p-2 bg-base-200/80 backdrop-blur-sm h-max max-h-screen min-h-screen overflow-y-auto overflow-x-clip w-screen sm:w-80 max-w-screen">
          <div className="fixed top-5 right-0 w-full px-5">
            <form method="dialog" className={'flex flex-row w-full items-center'}>
              <div className={'text-primary text-2xl'}>Navigation</div>
              <div className={'grow'}></div>
              <button className="text-3xl text-primary" aria-label="Close navigation">
                <IoClose />
              </button>
            </form>
          </div>

          <ul className="menu w-full h-full pt-14">
            <li>
                   <CMSLink {...highlightButton?.link} className='w-full' />
            </li>
            {navItems.map((item, i) => {
              if (item.itemType === 'parent') {
                const columns = columnsOf(item)

                if (!columns.length) return null

                return (
                  <li key={i}>
                    <details>
                      <summary className={'text-lg '}>
                        {item.label || 'Menu'}
                      </summary>
                      <ul className="rounded-t-none p-2 dropdown-start">
                        {columns.map((column, columnIdx) => (
                          <React.Fragment key={columnIdx}>
                            {column.heading && (
                              <li className="menu-title px-2 pt-2 pb-1 text-xs tracking-[0.08em]  uppercase">
                                {column.heading}
                              </li>
                            )}
                            {(column.links || []).map((subItem, idx) => (
                              <li key={idx}>
                                <CMSLink
                                  {...subItem.link}
                                  appearance={'inline'}
                                  className={cn('block w-full', ITEM_BOX)}
                                >
                                  <RichText
                                    data={subItem.content}
                                    enableGutter={false}
                                    enableProse={false}
                                    className={cn('max-w-none invert', itemTypography('sidebar'))}
                                  />
                                </CMSLink>
                              </li>
                            ))}
                          </React.Fragment>
                        ))}
                      </ul>
                    </details>
                  </li>
                )
              }

              return (
                <li key={i}>
                  <CMSLink
                    {...item.link}
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

// ---------------------------------------------------------------------------

type HighlightButtonType = HeaderType['highlightButton']
export const HighlightButton = ({ highlightButton }: { highlightButton: HighlightButtonType }) => {
  if (!highlightButton) {
    return null
  }
  return (
    <div className={'hidden md:flex md:navbar-end '}>
      <CMSLink className={'lg:ml-10 overflow-visible  '} {...highlightButton.link} />
    </div>
  )
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
        <ConvertRichText data={highlightBanner.bannerText} className={'px-3'} />

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

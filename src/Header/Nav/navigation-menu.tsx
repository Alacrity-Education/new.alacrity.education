'use client'

import * as React from 'react'
import { cva } from 'class-variance-authority'
import { ChevronDownIcon } from 'lucide-react'
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui'

import { cn } from '@/utilities/ui'

function NavigationMenu({
  className,
  children,
  viewport = true,
  viewportClassName,
  viewportWrapperClassName,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
  viewportClassName?: string
  viewportWrapperClassName?: string
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className,
      )}
      {...props}
    >
      {children}
      {viewport && (
        <NavigationMenuViewport
          className={viewportClassName}
          wrapperClassName={viewportWrapperClassName}
        />
      )}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  // Deliberately no height/radius here: triggers are handed a daisyUI button
  // variant by the consumer, which owns both.
  'group/navigation-menu-trigger inline-flex w-max items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50',
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), 'group', className)}
      {...props}
    >
      {children}{' '}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3 shrink-0 transition-transform duration-300 group-data-[state=open]/navigation-menu-trigger:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        'top-0 left-0 w-full ease-[cubic-bezier(0.22,1,0.36,1)]',
        // Standalone (viewport={false}) panels carry their own surface.
        'group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-box group-data-[viewport=false]/navigation-menu:bg-base-100 group-data-[viewport=false]/navigation-menu:text-base-content group-data-[viewport=false]/navigation-menu:shadow-2xl group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-base-300 group-data-[viewport=false]/navigation-menu:duration-300',
        'data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out',
        '**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
        'md:absolute',
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  wrapperClassName,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> & {
  wrapperClassName?: string
}) {
  return (
    <div className={cn('absolute top-full left-0 isolate z-50 flex justify-center', wrapperClassName)}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          'origin-top relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) overflow-hidden rounded-box bg-base-100 text-base-content shadow-2xl ring-1 ring-base-300 duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className,
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        'flex flex-col gap-1 rounded-field p-2 text-sm transition-colors outline-none hover:bg-base-200 focus:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary/40 data-[active]:bg-base-200',
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        'top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in',
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-base-300 shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}

import React from 'react'
import { cn } from '@/utilities/ui'

type CardVariant = 'base' | 'primary'

export function Card({
  children,
  className,
  variant = 'base',
}: {
  children?: React.ReactNode
  className?: string
  variant?: CardVariant
}) {
  return (
    <div
      className={cn(
        'w-78 aspect-4/5 flex flex-col relative overflow-clip p-4 shadow-lg  rounded-2xl',
        variant === 'base'
          ? 'bg-base-100 border-2 border-primary/20'
          : 'bg-primary border-2 border-primary-content/20',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardImage({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('h-34 w-full relative max-w-full overflow-clip rounded-xl', className)}>
      {children}
    </div>
  )
}

export function CardBody({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('grow w-full relative pt-4 rounded-lg', className)}>{children}</div>
  )
}

export function CardCell({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('h-full w-full relative max-w-full max-h-full overflow-clip rounded-lg', className)}>
      {children}
    </div>
  )
}

export function CardCTA({
  href,
  children,
  className,
  variant = 'base',
}: {
  href: string
  children: React.ReactNode
  className?: string
  variant?: CardVariant
}) {
  const btnClass =
    variant === 'base'
      ? 'btn bg-base-100 text-primary border-2 border-primary -translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_var(--color-primary)] hover:translate-x-0 hover:translate-y-0 hover:shadow-[0_0_0_0_var(--color-primary)] transition-all'
      : 'btn btn-primary text-primary-content border border-base-100 -translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_var(--color-base-100)] hover:translate-x-0 hover:translate-y-0 hover:shadow-[0_0_0_0_var(--color-base-100)] transition-all'

  return (
    <div className="pt-10 w-full">
      <a href={href} className={cn('btn-block rounded-xl', btnClass, className)}>
        {children}
      </a>
    </div>
  )
}

import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
  {
    variants: {
      variant: {
        default: 'btn border border-primary text-primary shadow-lg',
        primary: 'btn btn-primary border border-base-100 shadow-lg',
        secondary: 'btn btn-secondary border border-base-100 shadow-lg',
        ghost: 'btn btn-ghost ',
        link: 'text-primary underline-offset-4 hover:underline',

        // Primary overlap: primary-colored bg + white text, sitting on a primary-colored outline shadow
        primaryOverlap:
          'btn btn-primary text-primary-content border-1 border-base-100 -translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_var(--color-base-100)] hover:translate-x-0 hover:translate-y-0 hover:shadow-[0_0_0_0_var(--color-base-100)] transition-all  [[open]_&]:translate-x-0 [[open]_&]:translate-y-0 [[open]_&]:shadow-[0_0_0_0_var(--color-base-100)]',

        // Base overlap: white bg + primary text, sitting on a primary-colored outline shadow (inverted)
        baseOverlap:
          'btn btn-base bg-base-100 text-primary border-2 border-primary -translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_var(--color-primary)] hover:translate-x-0 hover:translate-y-0 hover:shadow-[0_0_0_0_var(--color-primary)] transition-all',
      },
      size: {
        clear: '',
        default: '',
        sm: 'btn-sm',
        lg: 'btn-lg',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

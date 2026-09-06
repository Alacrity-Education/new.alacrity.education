import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  //{/*<div className={"md:text-xl font-bold text-primary"}>Alacrity Education</div>*/ }
  return (
    /* eslint-disable @next/next/no-img-element */
<div className='flex flex-row justify-center gap-1'>
      <img src="/logo.png" className='h-10 sm:h-12' />
      <div className='divider divider-horizontal divider-primary px-0 mx-0'></div>
      <div className="flex justify-center text-sm sm:text-base text-primary font-semibold flex-col">
        <p className='-mb-1'>Alacrity</p>
        <p>Education</p>
      </div>
</div>
  )
}

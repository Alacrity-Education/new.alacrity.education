'use client'
import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { FormBlock } from '@/blocks/Form/Component'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ id, variant, links, richText, media }) => {
  const bgCls = {
    "base":"bg-base-100 border border-2 border-primary",
    "primary":"bg-primary",
  }

  const gradientCls = {
    "base" : "to-base-100 via-base-100",
    "primary":"to-primary via-primary",
  }

  const textCls = {
    base: 'text-primary prose-h2:text-primary prose-h3:text-primary prose-h4:text-primary prose-b:text-primary',
    primary:
      'text-primary-content prose-h2:text-primary-content prose-h3:text-primary-content prose-h:text-primary-content prose-b:text-primary-content',
  }

  return (
    <div className="container">
      <div className={cn('relative rounded-lg sm:h-80 shadow-xl', bgCls[variant || 'base'])}>
        <div className={'absolute inset-0 flex flex-row z-0 rounded-lg overflow-clip bg-inherit'}>
          <div className={'flex-1'}></div>
          <div className={'w-full h-full sm:min-w-1/2 sm:w-1/2 relative bg-inherit'}>
            <div className={cn('absolute inset-0 z-10 bg-linear-to-tl sm:bg-linear-to-l from-transparent sm:via-transparent sm:via-30%', gradientCls[variant || "base"])}></div>
            {media && <Media priority className={"relative z-0 h-full w-full object-cover"} pictureClassName={"h-full w-full object-cover"} imgClassName={"object-cover h-full w-full"} resource={media} />}
          </div>
        </div>

        <div className={'relative rounded-lg p-10 h-full w-full flex flex-col gap-8 z-20'}>
          <div className="max-w-[48rem]">
            {richText && (
              <RichText
                className={cn('mb-0', textCls[variant || 'base'])}
                data={richText}
                enableGutter={false}
              />
            )}
          </div>
          <div className={'grow'}></div>
          <div className="flex flex-row gap-8">
            {(links || []).map((item, i) => {
              if (item.ctaType === 'form') {
                const { formCta } = item
                if (!formCta?.form || typeof formCta.form !== 'object') return null

                const modalId = `cta-form-${id || 'block'}-${item.id || i}`

                return (
                  <React.Fragment key={i}>
                    <Button
                      variant={formCta.appearance || 'primary'}
                      className="max-w-max px-4"
                      onClick={() => (document.getElementById(modalId) as HTMLDialogElement)?.showModal()}
                    >
                      {formCta.label}
                    </Button>

                    <dialog id={modalId} className="modal">
                      <div className="modal-box max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <FormBlock
                          form={formCta.form as any}
                          enableIntro={false}
                          enableMap={false}
                        />
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                  </React.Fragment>
                )
              }

              return <CMSLink key={i} className={'max-w-max px-4'} {...item.link} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

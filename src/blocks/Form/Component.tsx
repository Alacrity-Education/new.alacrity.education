'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { FaPhone, FaEnvelope } from 'react-icons/fa6'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import FormMap from './Map'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  enableMap?: boolean | null
  mapLatitude?: number | null
  mapLongitude?: number | null
  enableContactInfo?: boolean | null
  contactTitle?: string | null
  contactPhone?: string | null
  contactPhoneHref?: string | null
  contactEmail?: string | null
}

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    enableMap,
    mapLatitude,
    mapLongitude,
    enableContactInfo,
    contactTitle,
    contactPhone,
    contactPhoneHref,
    contactEmail,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({ message: 'Something went wrong.' })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  const formContent = (
    <div className="p-4 lg:px-4 rounded-[0.8rem]">
      <FormProvider {...formMethods}>
        {!isLoading && hasSubmitted && confirmationType === 'message' && (
          <RichText data={confirmationMessage} />
        )}
        {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
        {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
        {!hasSubmitted && (
          <form id={formID} onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 last:mb-0">
              {formFromProps?.fields?.map((field, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                if (Field) {
                  return (
                    <div className="mb-6 last:mb-0" key={index}>
                      <Field
                        form={formFromProps}
                        {...field}
                        {...formMethods}
                        control={control}
                        errors={errors}
                        register={register}
                      />
                    </div>
                  )
                }
                return null
              })}
            </div>
            <Button form={formID} type="submit" variant="primary">
              {submitButtonLabel}
            </Button>
          </form>
        )}
      </FormProvider>
    </div>
  )

  if (!enableMap) {
    return (
      <div className="container lg:max-w-[48rem]">
        {enableIntro && introContent && !hasSubmitted && (
          <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
        )}
        {formContent}
      </div>
    )
  }

  return (
    <div className="container">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>{formContent}</div>

        {/* Map + contact info */}
        <div className="flex flex-col overflow-hidden rounded-xl shadow-sm border border-base-200">
          <div className="flex-grow min-h-[300px] relative">
            <FormMap latitude={mapLatitude ?? undefined} longitude={mapLongitude ?? undefined} />
          </div>

          {enableContactInfo && contactTitle && (
            <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-content p-4">
              <h3 className="text-lg font-bold mb-3 opacity-90">{contactTitle}</h3>
              <div className="flex flex-col gap-2 text-base">
                {contactPhone && (
                  <a
                    href={contactPhoneHref ?? undefined}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform shadow-sm">
                      <FaPhone className="h-3 w-3" />
                    </div>
                    <span className="font-medium tracking-wide text-sm md:text-base">
                      {contactPhone}
                    </span>
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform shadow-sm">
                      <FaEnvelope className="h-3 w-3" />
                    </div>
                    <span className="font-medium tracking-wide text-sm md:text-base">
                      {contactEmail}
                    </span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

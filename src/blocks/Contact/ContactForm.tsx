'use client'

import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { fields } from '@/blocks/Form/fields'
import { getClientSideURL } from '@/utilities/getURL'

interface ContactFormProps {
  form: FormType
}

export function ContactForm({ form: formFromProps }: ContactFormProps) {
  const { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } =
    formFromProps

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

        loadingTimerID = setTimeout(() => setIsLoading(true), 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({ form: formID, submissionData: dataToSend }),
            headers: { 'Content-Type': 'application/json' },
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

          if (confirmationType === 'redirect' && redirect?.url) {
            router.push(redirect.url)
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

  return (
    <FormProvider {...formMethods}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText data={confirmationMessage} />
      )}
      {isLoading && !hasSubmitted && (
        <p className="flex items-center gap-2">
          <span className="loading loading-spinner loading-sm" /> Loading, please wait...
        </p>
      )}
      {error && (
        <div className="alert alert-error mb-4 text-sm">
          {`${error.status || '500'}: ${error.message || ''}`}
        </div>
      )}
      {!hasSubmitted && (
        <form id={String(formID)} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {formFromProps.fields?.map((field, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
            if (!Field) return null
            return (
              <div key={index}>
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
          })}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full mt-2 text-lg font-semibold shadow-md"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner" /> Sending...
              </>
            ) : (
              submitButtonLabel || 'Send'
            )}
          </button>
        </form>
      )}
    </FormProvider>
  )
}

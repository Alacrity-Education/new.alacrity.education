'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

const PhoneIcon = () => (
  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const EmailIcon = () => (
  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

import { getClientSideURL } from '@/utilities/getURL'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  enableMap?: boolean
  mapComponent?: React.ComponentType<any>
  mapLongitude?: number
  mapLatitude?: number
  contactTitle?: string
  contactPhone?: string
  contactPhoneHref?: string
  contactEmail?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      className="btn btn-primary w-full mt-6 text-lg font-semibold shadow-md"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner"></span> Sending...
        </>
      ) : (
        'Send'
      )}
    </button>
  )
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    enableMap = false,
    mapComponent: MapComponent,
    mapLongitude = 26.094224,
    mapLatitude = 44.446075,
    contactTitle,
    contactPhone,
    contactPhoneHref,
    contactEmail,
  } = props

  const [state, setState] = useState<{ success: boolean; message: string }>({
    success: false,
    message: '',
  })
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (state.message) {
      setIsVisible(true)

      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [state])

  const handleFormSubmit = async (formData: FormData) => {
    setState({ success: false, message: '' })

    const dataToSend = Object.entries(Object.fromEntries(formData)).map(([name, value]) => ({
      field: name,
      value,
    }))

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

      if (req.status >= 400) {
        setState({
          success: false,
          message: res.errors?.[0]?.message || 'Internal Server Error',
        })
        return
      }

      setState({
        success: true,
        message: confirmationMessage ? 'Message sent successfully!' : 'Your message has been sent!',
      })

      if (confirmationType === 'redirect' && redirect) {
        setTimeout(() => {
          router.push(redirect.url)
        }, 1000)
      }
    } catch (err) {
      console.warn(err)
      setState({
        success: false,
        message: 'Oops, looks like something went wrong. Please try again.',
      })
    }
  }

  return (
    <>
      {enableIntro && introContent && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 container">
        {/* Form Section */}
        <div className="card-body p-8 relative">
          {isVisible && state.message && (
            <div
              role="alert"
              className={`
              absolute top-6 left-4 right-4 z-50 
              alert ${state.success ? 'alert-success' : 'alert-error'} 
              text-sm shadow-lg animate-in fade-in slide-in-from-top-2 duration-300
            `}
            >
              <button
                onClick={() => setIsVisible(false)}
                className="btn btn-xs btn-ghost btn-circle absolute right-2 top-2"
              >
                ✕
              </button>
              <span>{state.message}</span>
            </div>
          )}

          <h2 className="card-title text-3xl font-bold mb-6 text-base-content">Write a message</h2>

          <form action={handleFormSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="form-control w-full flex flex-col">
                <label className="label px-0">
                  <span className="label-text font-semibold text-base">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="input input-bordered w-full bg-base-200 focus:bg-base-100 focus:input-primary transition-colors"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-control w-full flex flex-col">
                <label className="label px-0">
                  <span className="label-text font-semibold text-base">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  className="input input-bordered w-full bg-base-200 focus:bg-base-100 focus:input-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div className="form-control w-full flex flex-col">
              <label className="label px-0">
                <span className="label-text font-semibold text-base">Subject</span>
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Ex: Partnership Inquiry"
                className="input input-bordered w-full bg-base-200 focus:bg-base-100 focus:input-primary transition-colors"
                required
              />
            </div>

            {/* Message */}
            <div className="form-control w-full flex flex-col">
              <label className="label px-0">
                <span className="label-text font-semibold text-base">Message</span>
              </label>
              <textarea
                name="message"
                className="textarea resize-none textarea-bordered h-40 text-base w-full bg-base-200 focus:bg-base-100 focus:textarea-primary transition-colors"
                placeholder="Hello, I would like to discuss..."
                required
              ></textarea>
            </div>

            <SubmitButton />
          </form>
        </div>

        {/* Contact Info & Map Section */}
        {(enableMap || contactTitle) && (
          <div id="contact-info" className="h-full p-6 lg:p-8">
            <div className="flex flex-col h-full w-full rounded-xl overflow-hidden shadow-sm border border-base-200">
              {/* Map */}
              {enableMap && MapComponent && (
                <div className="flex-grow w-full min-h-[300px] relative">
                  <MapComponent latitude={mapLatitude} longitude={mapLongitude} />
                </div>
              )}

              {/* Contact Details */}
              {contactTitle && (
                <div className="relative z-10 bg-gradient-to-br from-primary to-primary/70 text-primary-content p-4">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2 opacity-90">
                    {contactTitle}
                  </h3>

                  <div className="flex flex-col gap-2 text-base">
                    {/* Phone */}
                    {contactPhone && (
                      <a
                        href={contactPhoneHref}
                        className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform shadow-sm">
                          <PhoneIcon />
                        </div>
                        <span className="font-medium tracking-wide text-sm md:text-base">
                          {contactPhone}
                        </span>
                      </a>
                    )}

                    {/* Email */}
                    {contactEmail && (
                      <a
                        href={`mailto:${contactEmail}`}
                        className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform shadow-sm">
                          <EmailIcon />
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
        )}
      </div>
    </>
  )
}

'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { FaPhone, FaEnvelope } from 'react-icons/fa6'
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
                          <FaPhone className="h-3 w-3" />
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
        )}
      </div>
    </>
  )
}

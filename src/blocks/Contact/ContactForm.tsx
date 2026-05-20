'use client'

import React, { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { getClientSideURL } from '@/utilities/getURL'

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

interface ContactFormProps {
  formId: string
  confirmationType?: string
  redirectUrl?: string
}

export function ContactForm({ formId, confirmationType, redirectUrl }: ContactFormProps) {
  const [state, setState] = useState<{ success: boolean; message: string }>({
    success: false,
    message: '',
  })
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (state.message) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [state])

  const handleSubmit = async (formData: FormData) => {
    setState({ success: false, message: '' })

    const dataToSend = Object.entries(Object.fromEntries(formData)).map(([name, value]) => ({
      field: name,
      value,
    }))

    try {
      const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formId, submissionData: dataToSend }),
      })

      const res = await req.json()

      if (req.status >= 400) {
        setState({ success: false, message: res.errors?.[0]?.message || 'Internal Server Error' })
        return
      }

      setState({ success: true, message: 'Message sent successfully!' })

      if (confirmationType === 'redirect' && redirectUrl) {
        setTimeout(() => router.push(redirectUrl), 1000)
      }
    } catch {
      setState({
        success: false,
        message: 'Oops, looks like something went wrong. Please try again.',
      })
    }
  }

  return (
    <div className="relative">
      {isVisible && state.message && (
        <div
          role="alert"
          className={`absolute top-0 left-0 right-0 z-50 alert ${state.success ? 'alert-success' : 'alert-error'} text-sm shadow-lg animate-in fade-in slide-in-from-top-2 duration-300`}
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

      <form action={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <div className="form-control w-full flex flex-col">
          <label className="label px-0">
            <span className="label-text font-semibold text-base">Message</span>
          </label>
          <textarea
            name="message"
            className="textarea resize-none textarea-bordered h-40 text-base w-full bg-base-200 focus:bg-base-100 focus:textarea-primary transition-colors"
            placeholder="Hello, I would like to discuss..."
            required
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}

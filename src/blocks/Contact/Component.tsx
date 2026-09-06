import React from 'react'
import type { ContactBlock } from '@/payload-types'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import RichText from '@/components/RichText'
import { Map } from '@/components/Map'
import { ContactInfoCard } from '@/components/ContactInfoCard'
import { ContactForm } from './ContactForm'
import { hasRichTextContent } from '@/utilities/richText'

export const ContactBlockComponent: React.FC<ContactBlock> = ({
  heading,
  form,
  enableIntro,
  introContent,
  map,
  contactInfo,
}) => {
  if (typeof form === 'number') return null

  return (
    <section className="container my-16">
      {enableIntro && hasRichTextContent(introContent) && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}

      <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm p-6 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: form */}
          <div>
            {heading && (
              <h2 className="text-3xl font-bold mb-6 text-base-content">{heading}</h2>
            )}
            <ContactForm form={form as unknown as FormType} />
          </div>

          {/* Right: map + contact info card (stacked, visually attached) */}
          <div className="flex flex-col overflow-hidden rounded-xl shadow-sm border border-base-200">
            <div className="flex-1 min-h-[300px] relative">
              <Map
                latitude={map.latitude}
                longitude={map.longitude}
                zoom={map.zoom ?? 14}
                markerLabel={map.markerLabel ?? undefined}
                markerSubtitle={map.markerSubtitle ?? undefined}
                openInMapsUrl={map.openInMapsUrl ?? undefined}
                className="absolute inset-0"
              />
            </div>

            <ContactInfoCard
              heading={contactInfo?.heading}
              phone={contactInfo?.phone}
              phoneLabel={contactInfo?.phoneLabel}
              email={contactInfo?.email}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

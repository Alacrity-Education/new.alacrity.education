import React from 'react'
import { FaPhone, FaEnvelope } from 'react-icons/fa6'

type ContactInfoCardProps = {
  heading?: string | null
  phone?: string | null
  phoneLabel?: string | null
  email?: string | null
  className?: string
}

export function ContactInfoCard({
  heading,
  phone,
  phoneLabel,
  email,
  className,
}: ContactInfoCardProps) {
  if (!phone && !email) return null

  return (
    <div
      className={[
        'bg-gradient-to-br from-primary to-primary/70 text-primary-content p-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {heading && <h3 className="text-lg font-bold mb-3 opacity-90">{heading}</h3>}

      <div className="flex flex-col gap-2">
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform shadow-sm">
              <FaPhone className="h-3 w-3" />
            </div>
            <span className="font-medium tracking-wide text-sm md:text-base">{phone}</span>
            {phoneLabel && <span className="text-sm opacity-75">{phoneLabel}</span>}
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform shadow-sm">
              <FaEnvelope className="h-3 w-3" />
            </div>
            <span className="font-medium tracking-wide text-sm md:text-base">{email}</span>
          </a>
        )}
      </div>
    </div>
  )
}

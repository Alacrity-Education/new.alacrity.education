import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Media } from '@/components/Media'

interface CardBlockProps {
  type: 'projects' | 'perks'
  heading?: string | null
  className?: string
}

export const CardBlock: React.FC<CardBlockProps> = async ({ type, heading, className }) => {
  const payload = await getPayload({ config })

  const collection = type === 'projects' ? 'projects' : 'showcase'

  const { docs } = await payload.find({
    collection,
    depth: 1,
  })

  return (
    <div
      className={
        'w-screen min-h-max bg-gradient-to-b from-base-300 to-base-100 dark:via-base-300 px-4 pb-10 lg:px-20 h-max ' +
        (className ? className : '')
      }
    >
      {heading && (
        <h2 className="text-2xl sm:text-5xl font-semibold py-16 text-center">{heading}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc: any) => (
          <div key={doc.id} className="border border-border rounded-lg overflow-hidden bg-card">
            {doc.image && (
              <div className="relative w-full h-48">
                <Media resource={doc.image} size="100%" />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{doc.name || doc.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {doc.description || doc.cardText}
              </p>
              {(doc.link || doc.url || doc.linkUrl) && (
                <a
                  href={doc.link || doc.url || doc.linkUrl}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.linkText || 'Learn More'}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

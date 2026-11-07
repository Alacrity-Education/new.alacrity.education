import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const WEBP = { format: 'webp', options: { quality: 80 } } as const

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'defaultZoom',
      type: 'number',
      label: 'Default Camera Distance (3D)',
      defaultValue: 5,
      admin: {
        description: 'Camera distance from the 3D model. Lower = closer. Only applies to .glb/.gltf files.',
        condition: (data) =>
          ['model/gltf-binary', 'model/gltf+json'].includes(data?.mimeType ?? '') ||
          /\.(glb|gltf)$/i.test(data?.filename ?? ''),
      },
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // Generated sizes are re-encoded, whatever the upload's format: photos are
    // often uploaded as PNG, which kept a "resized" 1920px copy at 6–15 MB. WebP
    // at quality 80 is visually the same at a few hundred KB. The social card
    // stays JPEG, which every platform's link preview reads. The original upload
    // is kept as it was.
    imageSizes: [
      { name: 'thumbnail', width: 300, formatOptions: WEBP },
      { name: 'square', width: 500, height: 500, formatOptions: WEBP },
      { name: 'small', width: 600, formatOptions: WEBP },
      { name: 'medium', width: 900, formatOptions: WEBP },
      { name: 'large', width: 1400, formatOptions: WEBP },
      { name: 'xlarge', width: 1920, formatOptions: WEBP },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: { format: 'jpeg', options: { quality: 82, mozjpeg: true } },
      },
    ],
  },
}

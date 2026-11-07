import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { collectionTemplatesPlugin } from '@alacrity-education/payload-plugin-collection-templates'
import { payloadPluginCollectionsGlobalsWebhook } from '@alacrity-education/payload-plugin-collections-globals-webhook'
import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { titleFor } from '@/utilities/siteMetadata'
import type { WebhookDocumentContext } from '@alacrity-education/payload-plugin-collections-globals-webhook'

const publishedOnly = ({ doc }: WebhookDocumentContext): boolean => doc._status === 'published'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return titleFor(doc?.title)
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  collectionTemplatesPlugin({
    collections: {
      pages: true,
      posts: { exclude: ['author'] },
    },
  }),
  payloadPluginCollectionsGlobalsWebhook({
    // Always enabled, even without a URL. Disabling it when the variable was
    // unset also dropped its admin component from the import map, which is
    // generated on machines without the variable — so production, which has the
    // URL, shipped an admin that never called the webhook. Without a URL the
    // plugin now says so in the edit view on save ("Webhook target is not
    // configured") instead of doing nothing silently.
    url: process.env.PAYLOAD_WEBHOOK_URL,
    // Everything that can change the built output, not just what the routes query
    // directly: a member rendered inside a person-card block, or a swapped image,
    // changes a page without that page being written to.
    //
    // Only pages and posts have drafts, so only they can be filtered to
    // published saves (a draft save changes nothing on the live site). The
    // rest have no _status at all: filtering them on it matched nothing, so
    // header, footer, media, member and category saves never fired.
    collections: {
      pages: { filter: publishedOnly },
      posts: { filter: publishedOnly },
      categories: true,
      media: true,
      members: true,
    },
    globals: {
      header: true,
      footer: true,
    },
  }),
]

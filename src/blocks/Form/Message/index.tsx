import RichText from '@/components/RichText'
import React from 'react'

import { Width } from '../Width'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { hasRichTextContent } from '@/utilities/richText'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  return (
    <Width className="my-12" width="100">
      {hasRichTextContent(message) && <RichText data={message} />}
    </Width>
  )
}

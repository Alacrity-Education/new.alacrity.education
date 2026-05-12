'use client'
import React, { ReactNode } from 'react'
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import {
  RichText,
  type JSXConvertersFunction,
  JSXConverters,
} from '@payloadcms/richtext-lexical/react'
import type {
  StateValues,
  TextStateFeatureProps,
} from 'node_modules/@payloadcms/richtext-lexical/dist/features/textState/feature.server'

import { defaultColors } from '@payloadcms/richtext-lexical/client'

const ArrowUnderline = () => (
  <svg
    viewBox="0 0 222 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'absolute',
      top: 'calc(100% + 10px)',
      left: 0,
      width: '100%',
      height: 'auto',
      pointerEvents: 'none',
    }}
    aria-hidden="true"
  >
    <path
      d="M119.769 8.4487L119.376 10.4096L119.769 8.4487ZM184.48 4.43307L185.168 6.31078L184.48 4.43307ZM205.066 36.5389C205.844 37.3226 207.111 37.3269 207.894 36.5485L220.665 23.8637C221.449 23.0853 221.453 21.819 220.675 21.0353C219.896 20.2516 218.63 20.2473 217.846 21.0257L206.494 32.3011L195.219 20.9492C194.441 20.1655 193.174 20.1612 192.391 20.9396C191.607 21.718 191.603 22.9843 192.381 23.768L205.066 36.5389ZM2.66371 2.91441C1.62167 2.54804 0.479927 3.09577 0.113549 4.1378C-0.252828 5.17984 0.294902 6.32159 1.33694 6.68796L2.00032 4.80119L2.66371 2.91441ZM58.9428 8.57141L59.3686 10.5255V10.5255L58.9428 8.57141ZM119.769 8.4487L119.376 10.4096C134.951 13.5342 146.199 14.4463 156.201 13.5854C166.209 12.7239 174.848 10.0957 185.168 6.31078L184.48 4.43307L183.791 2.55536C173.579 6.30054 165.335 8.78433 155.858 9.60013C146.373 10.4166 135.533 9.57137 120.163 6.48778L119.769 8.4487ZM184.48 4.43307L185.168 6.31078C193.152 3.38295 197.956 3.58675 200.815 5.00136C203.588 6.37323 205.109 9.18556 205.769 13.0482C206.429 16.9086 206.149 21.4173 205.664 25.5133C205.422 27.5509 205.138 29.4293 204.906 31.0643C204.682 32.636 204.488 34.0968 204.485 35.1227L206.485 35.1295L208.485 35.1363C208.487 34.4438 208.631 33.2822 208.866 31.6271C209.092 30.0353 209.387 28.0824 209.636 25.9841C210.131 21.8083 210.473 16.8263 209.712 12.3742C208.951 7.92452 207.008 3.60281 202.589 1.4162C198.256 -0.727649 192.141 -0.506741 183.791 2.55536L184.48 4.43307ZM2.00032 4.80119L1.33694 6.68796C15.6516 11.721 23.6544 14.1893 31.3832 14.5957C39.1067 15.0018 46.4632 13.3379 59.3686 10.5255L58.9428 8.57141L58.5169 6.61727C45.4138 9.47276 38.6588 10.9727 31.5932 10.6012C24.5329 10.2299 17.0688 7.9792 2.66371 2.91441L2.00032 4.80119ZM58.9428 8.57141L59.3686 10.5255C67.0784 8.84542 74.3862 7.29501 83.5998 6.91505C92.811 6.53519 103.997 7.32435 119.376 10.4096L119.769 8.4487L120.163 6.48778C104.541 3.35367 93.0292 2.5228 83.435 2.91845C73.8432 3.31401 66.2381 4.93465 58.5169 6.61727L58.9428 8.57141Z"
      fill="currentColor"
    />
  </svg>
)

const colorState = {
  color: {
    ...defaultColors.text,
    primary: {
      label: 'Primary',
      css: {
        color: 'var(--color-primary)',
      },
    },
    secondary: {
      label: 'Secondary',
      css: {
        color: 'var(--color-secondary)',
      },
    },
    arrowHighlighted: {
      label: 'ArrowHighlighted',
      css: {
        color: 'var(--color-primary)',
        position: 'relative',
        display: 'inline-block',
      },
    },
  },
}
type ExtractAllColorKeys<T> = {
  [P in keyof T]: T[P] extends StateValues ? keyof T[P] : never
}[keyof T]

type ColorStateKeys = ExtractAllColorKeys<typeof colorState>
export const customConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,

  text: ({ node }) => {
    const text = node.text
    const styles: React.CSSProperties = {}
    let hasArrow = false

    if (node.$) {
      Object.entries(colorState).forEach(([stateKey, stateValues]) => {
        // @ts-expect-error
        const stateValue = node.$[stateKey] as ColorStateKeys
        if (stateValue && stateValues[stateValue]) {
          // @ts-expect-error
          Object.assign(styles, stateValues[stateValue].css)
          if (stateValue === 'arrowHighlighted') hasArrow = true
        }
      })

      return (
        <span style={styles}>
          {text}
          {hasArrow && <ArrowUnderline />}
        </span>
      )
    }

    return <span>{text}</span>
  },
})

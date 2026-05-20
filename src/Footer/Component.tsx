import { getCachedGlobal } from '@/utilities/getGlobals'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaXTwitter,
} from 'react-icons/fa6'

import type { Footer } from '@/payload-types'

const SocialIcon = ({ platform }: { platform: string }) => {
  const cls = 'h-full w-full'
  switch (platform) {
    case 'instagram': return <FaInstagram className={cls} />
    case 'linkedin':  return <FaLinkedin className={cls} />
    case 'facebook':  return <FaFacebook className={cls} />
    case 'youtube':   return <FaYoutube className={cls} />
    case 'twitter':   return <FaXTwitter className={cls} />
    default:          return null
  }
}

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)() as any as Footer

  const navColumns  = footerData?.navColumns  || []
  const socialLinks = footerData?.socialLinks || []
  const tagline     = footerData?.tagline     || 'Changing the education of the future.'

  return (
    <>
      {/* Navigation columns */}
      <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10 z-10 relative">
        {navColumns.map((col, i) => (
          <nav key={i}>
            <h6 className="footer-title">{col.title}</h6>
            {(col.links || []).map((item, j) => (
              <Link
                key={j}
                href={item.href}
                className="link link-hover"
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                download={item.download || undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ))}
      </footer>

      {/* Bottom bar: logo + tagline + social */}
      <footer className="footer bg-base-200 text-base-content border-base-300 border-t px-10 py-4 flex flex-col sm:flex-row items-center gap-4">
        <aside className="flex flex-col sm:flex sm:flex-row items-center gap-3">
          <Image
            className="h-20 w-20 sm:h-12 sm:w-12"
            src="/logo.svg"
            height={50}
            width={50}
            alt="Alacrity logo"
          />
          <p className="text-center sm:text-start">
            <b>Alacrity Education</b>
            <br />
            {tagline}
          </p>
        </aside>

        <div className="sm:grow" />

        {socialLinks.length > 0 && (
          <nav className="md:place-self-center md:justify-self-end">
            <div className="grid grid-flow-col gap-4">
              {socialLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 p-1 rounded-lg btn btn-primary"
                  aria-label={item.platform}
                >
                  <SocialIcon platform={item.platform} />
                </Link>
              ))}
            </div>
          </nav>
        )}
      </footer>
    </>
  )
}

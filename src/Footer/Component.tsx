import { getCachedGlobal } from '@/utilities/getGlobals'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { LuFacebook, LuInstagram, LuLinkedin, LuX, LuYoutube } from "react-icons/lu";

import type { Footer } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { FaLinkedinIn } from 'react-icons/fa6';

const SocialIcon = ({ platform }: { platform: string }) => {
  const cls = 'h-full w-full text-primary opacity-80'
  switch (platform) {
    case 'instagram': return <LuInstagram className={cls} />
    case 'linkedin':  return <FaLinkedinIn className={cls} />
    case 'facebook':  return <LuFacebook className={cls} />
    case 'youtube':   return <LuYoutube className={cls} />
    case 'twitter':   return <LuX className={cls} />
    default:          return null
  }
}

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)() as any as Footer

  const navColumns  = footerData?.navColumns  || []
  const socialLinks = footerData?.socialLinks || []
  const tagline     = footerData?.tagline     || 'Changing the education of the future.'

  return (
    <footer className="relative min-h-[80vh] overflow-clip bg-linear-to-b from-base-200 to-base-100 pt-10">
      <div className="absolute inset-x-0 mark-burn -bottom-10 z-0 px-1 text-[21vw] leading-none opacity-80 tracking-tighter font-semibold text-transparent w-full text-center bg-clip-text bg-linear-to-tr from-primary to-brand-500">
        Alacrity
      </div>
      {/* Softens the watermark; it paints over it (z-10 vs z-0) and is at its
          most opaque exactly where the word sits, so /80 all but erased it. */}
      <div className='absolute inset-0 bg-linear-to-t from-base-300 to-transparent z-10'></div>


      <div className="container relative z-10 flex flex-col gap-10 px-6 py-4 text-sm sm:px-10 lg:flex-row lg:gap-16">
        <aside className="flex shrink-0 flex-col items-start gap-4 lg:w-56 ">
          <Logo />

          {socialLinks.length > 0 && (
            <nav className="flex flex-row flex-wrap gap-2 mt-3" aria-label="Social media">
              {socialLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8"
                  aria-label={item.platform}
                >
                  <SocialIcon platform={item.platform} />
                </Link>
              ))}
            </nav>
          )}
        </aside>

        {navColumns.length > 0 && (
          /* 2 across on mobile, then 3 / 4 / 5. The config caps navColumns at
             10, so from xl up the columns can never spill past two rows. */
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:leading-6">
            {navColumns.map((col, i) => (
              <nav key={i} className="flex min-w-0 flex-col gap-2">
                <h6 className="footer-title mb-0">{col.title}</h6>
                {(col.links || []).map((item, j) => (
                  <CMSLink
                    key={j}
                    {...item.link}
                    download={item.download}
                    appearance="inline"
                    className="link link-hover"
                  />
                ))}
              </nav>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}

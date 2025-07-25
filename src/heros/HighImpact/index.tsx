'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import styles from './HighImpact.module.css'

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  mediaClassNames,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })
  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-146 md:text-center">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className={`min-h-[80vh] select-none ${styles.heroImage}`}>
        {media && typeof media === 'object' && (
          <Media
            fill
            imgClassName={`-z-10 object-cover ${mediaClassNames}`}
            priority
            resource={media}
          />
        )}
      </div>
    </div>
  )
}

import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { LogoGlobal } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import Image from 'next/image'

export async function LogoRectangle() {
  const logoGlobalData: LogoGlobal = await getCachedGlobal('logoGlobal', 2)()

  const { logo_rectangle } = logoGlobalData
  if (
    !logo_rectangle ||
    typeof logo_rectangle !== 'object' ||
    !('url' in logo_rectangle) ||
    !logo_rectangle.url
  )
    return null
  return (
    <Image
      src={logo_rectangle.url}
      alt={logo_rectangle.alt || 'Logo'}
      width={logo_rectangle.width || 170}
      height={logo_rectangle.height || 50}
    />
  )
}

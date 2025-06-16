import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { LogoGlobal } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import Image from 'next/image'

export async function LogoSquare() {
  const logoGlobalData: LogoGlobal = await getCachedGlobal('logoGlobal', 2)()

  const { logo_square } = logoGlobalData
  if (
    !logo_square ||
    typeof logo_square !== 'object' ||
    !('url' in logo_square) ||
    !logo_square.url
  )
    return null
  return (
    <Image
      src={logo_square.url}
      alt={logo_square.alt || 'Logo'}
      width={logo_square.width || 200}
      height={logo_square.height || 200}
    />
  )
}

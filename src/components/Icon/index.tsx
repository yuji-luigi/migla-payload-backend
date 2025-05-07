import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { getCachedGlobal } from '../../utilities/getGlobals'
import { LogoGlobal } from '../../payload-types'

export default async function Icon() {
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
      src="/images/rainbow_icon.png"
      alt={logo_square.alt || 'Logo'}
      width={logo_square.width || 200}
      height={logo_square.height || 200}
    />
  )
}

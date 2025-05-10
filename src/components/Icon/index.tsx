import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { getCachedGlobal } from '../../utilities/getGlobals'
import { LogoGlobal } from '../../payload-types'

export default async function Icon() {
  const logoGlobalData: LogoGlobal = await getCachedGlobal('logoGlobal', 2)()
  console.log(logoGlobalData)
  const { logo_square, logo_icon } = logoGlobalData
  if (!logo_icon || typeof logo_icon !== 'object' || !('url' in logo_icon) || !logo_icon.url)
    return null
  return (
    <Image
      src={logo_icon?.url}
      alt={logo_icon?.alt || 'Logo'}
      width={logo_icon?.width || 200}
      height={logo_icon?.height || 200}
    />
  )
}

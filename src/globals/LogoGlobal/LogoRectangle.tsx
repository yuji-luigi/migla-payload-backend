import { getCachedGlobal } from '@/utilities/getGlobals'

import type { LogoGlobal } from '@/payload-types'

import Image from 'next/image'

export async function LogoRectangle({ className }: { className?: string }) {
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
      className={className}
      src={logo_rectangle.url}
      alt={logo_rectangle.alt || 'Logo'}
      width={logo_rectangle.width || 170}
      height={logo_rectangle.height || 50}
    />
  )
}

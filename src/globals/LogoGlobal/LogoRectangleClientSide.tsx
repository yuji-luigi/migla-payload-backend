'use client'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { LogoGlobal } from '@/payload-types'

import Image from 'next/image'
import { usePayloadAPI } from '@payloadcms/ui'

export function LogoRectangleClientSide({ className }: { className?: string }) {
  const [result] = usePayloadAPI('/api/globals/logoGlobal')
  console.log(result)
  const { logo_rectangle } = result.data
  if (
    !logo_rectangle ||
    typeof logo_rectangle !== 'object' ||
    !('url' in logo_rectangle) ||
    !logo_rectangle.url
  )
    return null

  return (
    <Image
      className={`${className} bg-white p-2 rounded-lg`}
      src={logo_rectangle.url}
      alt={logo_rectangle.alt || 'Logo'}
      width={logo_rectangle.width || 170}
      height={logo_rectangle.height || 50}
    />
  )
}

import { getCachedGlobal } from '@/utilities/getGlobals'

import type { LogoGlobal } from '@/payload-types'

import Image from 'next/image'

const LogoServer = async () => {
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
      className="logo-rectangle"
      alt="logo"
      width={200}
      height={90}
      src={logo_rectangle.url}
      //   width={logo_rectangle.width || 170}
      //   height={logo_rectangle.height || 50}
    />
  )
}

export default LogoServer

import React from 'react'
import styles from './LogoRectangle.module.css'
import Image from 'next/image'
import Link from 'next/link'
export const LogoRectangle = () => {
  return (
    <Link href="/">
      <Image
        className={styles.logo}
        src="/images/migla-logo-rectangle.png"
        alt="logo"
        width={170}
        height={50}
      />
    </Link>
  )
}

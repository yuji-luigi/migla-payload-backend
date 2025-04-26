import Image from 'next/image'
import Link from 'next/link'
import styles from './layout.module.css'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import CircleBoxDecoration from './_components/decorations/CircleBoxDecoration'
import { cn } from '../../utilities/ui'

import { env } from 'process'
import { ApolloProvider } from '@apollo/client'
import { client } from '../../utilities/apolloClient'
import { MetaTitleComponent } from '@payloadcms/plugin-seo/client'
// export const metadata = {
//   title: '先生 ログイン| MIGLA',
//   description: 'MIGLA 先生方のログインページです',
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      data-theme="light"
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <header className={styles.header}>
          <div className="flex flex-row justify-between items-center">
            <Link href="/">
              <Image
                className={styles.logo}
                src="/images/migla-logo-rectangle.png"
                alt="logo"
                width={170}
                height={50}
              />
            </Link>
            <nav>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/">Home</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        >
          <CircleBoxDecoration position="topLeft" />
          <CircleBoxDecoration position="bottomRight" />
        </div>
      </body>
    </html>
  )
}

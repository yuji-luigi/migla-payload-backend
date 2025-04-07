import Image from 'next/image'
import Link from 'next/link'
import styles from './layout.module.css'
import './globals.css'
export const metadata = {
  title: '先生 ログイン| MIGLA',
  description: 'MIGLA 先生方のログインページです',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="light" lang="en">
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
      </body>
    </html>
  )
}

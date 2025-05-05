import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { cn } from '../../utilities/ui'
import CircleBoxDecoration from './_components/decorations/CircleBoxDecoration'
import './globals-teacher.css'
import './layout-global.css'

// export const metadata = {
//   title: '先生 ログイン| MIGLA',
//   description: 'MIGLA 先生方のログインページです',
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      data-theme="light"
      className={cn(GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
    >
      <body>
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

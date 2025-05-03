import React from 'react'
import { LogoRectangle } from '../../logo/logo_rectandle/LogoRectangle'
import Link from 'next/link'
export const DashbardHeaderNavBar = () => {
  return (
    <header className="header">
      <div className="flex flex-row justify-between items-center">
        <LogoRectangle />
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

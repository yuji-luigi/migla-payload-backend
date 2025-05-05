import React from 'react'
import { LogoRectangle } from '../../logo/logo_rectandle/LogoRectangle'
import Link from 'next/link'
export const DashboardHeaderNavBar = () => {
  return (
    <header className="header">
      <div className="flex flex-row justify-between items-center">
        <LogoRectangle href="/teacher/dashboard" />
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </nav>
        <select name="language" id="language">
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>
    </header>
  )
}

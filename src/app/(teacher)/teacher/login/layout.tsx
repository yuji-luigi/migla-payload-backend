import { Metadata } from 'next'
import React from 'react'
import LoginHeaderBar from './LoginHeaderBar'

export const metadata: Metadata = {
  title: '先生 ログイン| MIGLA',
  description: '先生 ログイン| MIGLA',
}

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LoginHeaderBar />
      {children}
    </>
  )
}

export default LoginLayout

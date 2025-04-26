import { Metadata } from 'next'
import React from 'react'
import { ApolloClientProvider } from '../../_components/apolloProvider/ApolloClientProvider'

export const metadata: Metadata = {
  title: '先生 ログイン| MIGLA',
  description: '先生 ログイン| MIGLA',
}

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default LoginLayout

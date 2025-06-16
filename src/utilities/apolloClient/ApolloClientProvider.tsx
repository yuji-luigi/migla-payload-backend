'use client'
import React from 'react'
import { client } from './apolloClient'
import { ApolloProvider } from '@apollo/client'

export const ApolloClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

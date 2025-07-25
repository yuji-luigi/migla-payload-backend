'use client'
import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { client } from '../../../../utilities/apolloClient/apolloClient'

export const ApolloClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

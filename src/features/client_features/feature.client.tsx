'use client'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { env } from 'process'
import { DataProvider } from './context/dataContext'
const client = new ApolloClient({
  uri: `${env.NEXT_PUBLIC_SERVER_URL}/api/graphql`,
  cache: new InMemoryCache(),
})
const ApolloCtx = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

// Example usage with createClientFeature (assuming from some lib)
export const MyClientFeature = createClientFeature({
  providers: [ApolloCtx, DataProvider],
})

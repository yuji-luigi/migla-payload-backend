// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// Setup the HTTP Link (Payload's GraphQL API)
const httpLink = new HttpLink({
  uri: '/api/graphql', // Use relative URL since it's the same Next.js instance
})

// Optional: Add auth headers (if needed)
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
})

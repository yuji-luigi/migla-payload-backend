import { Config } from 'payload'
import paymentRecordsToNotify from './queries/paymentRecordsToNofify/resolver'

export const graphQLConfig: Config['graphQL'] = {
  queries: (GraphQL, payload) => ({
    PaymentRecordsToNotify: {
      // Reuse the collection’s built paginated type
      type: payload.collections.paymentRecords?.graphQL?.paginatedType,

      args: {
        payerId: { type: GraphQL.GraphQLID }, // accept string/number
        now: { type: GraphQL.GraphQLString }, // ISO string preferred
        unpaidOnly: { type: GraphQL.GraphQLBoolean },
        page: { type: GraphQL.GraphQLInt },
        limit: { type: GraphQL.GraphQLInt },
      },

      // Keep resolver separate
      resolve: paymentRecordsToNotify,
    },
  }),
}

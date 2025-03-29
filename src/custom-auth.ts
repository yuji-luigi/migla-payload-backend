import { Payload } from 'payload'

export const customAuth = {
  disableLocalStrategy: true,
  strategies: [
    {
      name: 'custom-strategy',
      authenticate: async ({ payload, headers }: { payload: Payload; headers: Headers }) => {
        const usersQuery = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: headers.get('code'),
            },
            secret: {
              equals: headers.get('secret'),
            },
          },
        })

        return {
          // Send the user with the collection slug back to authenticate,
          // or send null if no user should be authenticated
          user: usersQuery.docs[0]
            ? {
                collection: 'users',
                ...usersQuery.docs[0],
              }
            : null,

          // Optionally, you can return headers
          // that you'd like Payload to set here when
          // it returns the response
          responseHeaders: new Headers({
            'some-header': 'my header value',
          }),
        }
      },
    },
  ],
}

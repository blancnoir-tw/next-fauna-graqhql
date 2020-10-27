import { GraphQLClient } from 'graphql-request'

const endpoint = 'https://graphql.fauna.com/graphql'

export const graphQLClient = (token?: string | null) => {
  const secret = token || process.env.NEXT_PUBLIC_FAUNA_GUEST_SECRET

  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${secret}`,
      'X-Schema-Preview': 'partial-update-mutation',
    },
  })
}

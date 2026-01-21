import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { typeDefs } from './graphql/schema/index.js'
import { resolvers } from './graphql/resolvers/index.js'
import { createContext } from './graphql/context.js'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  context: createContext,
  listen: { port: 4000 },
})

console.log(`🚀 GraphQL ready at ${url}`)

import { readFileSync } from 'fs'
import { join } from 'path'

export const typeDefs = [
  readFileSync(join(process.cwd(), 'graphql/schema/categoria.graphql'), 'utf8'),
  readFileSync(join(process.cwd(), 'graphql/schema/conceptogasto.graphql'), 'utf8'),
  readFileSync(join(process.cwd(), 'graphql/schema/usuario.graphql'), 'utf8'),
]

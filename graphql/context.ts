import { prisma } from '../lib/prisma.js'

export interface Context {
  prisma: typeof prisma
}

export const createContext = async (): Promise<Context> => ({
  prisma,
})

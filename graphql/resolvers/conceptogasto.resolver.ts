import type { ResolverFn } from '../types.js'

export const conceptoGastoResolvers = {
  Query: {
    conceptosGasto: (async (_p, _a, { prisma }) => {
      return prisma.conceptogastopresupuesto.findMany({
        where: { activo: true },
      })
    }) satisfies ResolverFn,
  },
}

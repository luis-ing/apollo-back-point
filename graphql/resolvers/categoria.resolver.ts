import type { ResolverFn } from '../types.js'

export const categoriaResolvers = {
  Query: {
    categorias: (async (_parent, _args, { prisma }) => {
      return prisma.categoria.findMany({
        where: { activo: true },
      })
    }) satisfies ResolverFn,

    categoria: (async (_parent, { id }, { prisma }) => {
      return prisma.categoria.findUnique({
        where: { idcategoria: id },
      })
    }) satisfies ResolverFn<{ id: number }>,
  },
}

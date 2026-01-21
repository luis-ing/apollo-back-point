import { describe, it, expect, vi, beforeEach } from 'vitest'
import { categoriaResolvers } from '../../graphql/resolvers/categoria.resolver.js'
import { prismaMock } from '../__mocks__/prisma.mock.js'

const context = {
  prisma: prismaMock,
}

describe('categoriaResolvers', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Query.categorias', () => {

    it('obtiene solo categorías activas', async () => {
      const categoriasMock = [
        { idcategoria: 1, nombre: 'Comida', activo: true },
        { idcategoria: 2, nombre: 'Renta', activo: true },
      ]

      prismaMock.categoria.findMany.mockResolvedValue(categoriasMock)

      const result = await categoriaResolvers.Query.categorias(
        {},
        {},
        context as any
      )

      expect(prismaMock.categoria.findMany).toHaveBeenCalledOnce()
      expect(prismaMock.categoria.findMany).toHaveBeenCalledWith({
        where: { activo: true },
      })

      expect(result).toEqual(categoriasMock)
    })
  })

  describe('Query.categoria', () => {

    it('obtiene una categoría por id', async () => {
      const categoriaMock = {
        idcategoria: 1,
        nombre: 'Comida',
        activo: true,
      }

      prismaMock.categoria.findUnique.mockResolvedValue(categoriaMock)

      const result = await categoriaResolvers.Query.categoria(
        {},
        { id: 1 },
        context as any
      )

      expect(prismaMock.categoria.findUnique).toHaveBeenCalledOnce()
      expect(prismaMock.categoria.findUnique).toHaveBeenCalledWith({
        where: { idcategoria: 1 },
      })

      expect(result).toEqual(categoriaMock)
    })

    it('retorna null si la categoría no existe', async () => {
      prismaMock.categoria.findUnique.mockResolvedValue(null)

      const result = await categoriaResolvers.Query.categoria(
        {},
        { id: 999 },
        context as any
      )

      expect(result).toBeNull()
    })
  })
})

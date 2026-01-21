import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { usuarioResolvers } from '../../graphql/resolvers/usuario.resolver.js'
import { prismaMock } from '../__mocks__/prisma.mock.js'

vi.mock('bcryptjs')
vi.mock('jsonwebtoken')

const context = {
  prisma: prismaMock,
}

describe('usuarioResolvers - LoginUsuario', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Query.LoginUsuario', () => {
    it('retorna 401 si el usuario no existe', async () => {
      prismaMock.usuario.findFirst.mockResolvedValue(null)
  
      const result = await usuarioResolvers.Query.LoginUsuario(
        {},
        { email: 'test@mail.com', password: '123456' },
        context as any
      )
  
      expect(result.STATUS).toBe(401)
      expect(result.message).toContain('no existentes')
    })
  
    it('retorna 401 si la contraseña es incorrecta', async () => {
      prismaMock.usuario.findFirst.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        contrasena: 'hashed',
        activo: true,
      })
  
      ;(bcrypt.compare as any).mockResolvedValue(false)
  
      const result = await usuarioResolvers.Query.LoginUsuario(
        {},
        { email: 'test@mail.com', password: 'wrong' },
        context as any
      )
  
      expect(result.STATUS).toBe(401)
    })
  
    it('retorna token si login es correcto', async () => {
      prismaMock.usuario.findFirst.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        contrasena: 'hashed',
        nombreUsuario: 'Luis',
        imgURL: null,
        temaOscuro: false,
        activo: true,
      })
  
      ;(bcrypt.compare as any).mockResolvedValue(true)
      ;(jwt.sign as any).mockReturnValue('FAKE_TOKEN')
  
      const result = await usuarioResolvers.Query.LoginUsuario(
        {},
        { email: 'test@mail.com', password: '123456' },
        context as any
      )
  
      expect(result.STATUS).toBe(200)
      expect(result.token).toBe('FAKE_TOKEN')
      // expect(result.data.email).toBe('test@mail.com')
    })

    it('retorna 500 si hay un error inesperado', async () => {
      prismaMock.usuario.findFirst.mockRejectedValue(new Error('DB error'))

      const result = await usuarioResolvers.Query.LoginUsuario(
        {},
        { email: 'test@mail.com', password: '123456' },
        context as any
      )

      expect(result.STATUS).toBe(500)
    })
  })


  describe('Query.usuarios y Query.usuario', () => {
    it('Listado de usuarios maneja excepción y retorna arreglo vacío', async () => {
      prismaMock.usuario.findMany.mockRejectedValue(new Error('DB error'))
      const result = await usuarioResolvers.Query.usuarios(
        {},
        {},
        context as any
      )
      expect(result).toEqual([])
    })
  
    it('Obtener listado de usuarios', async () => {
      const usuariosMock = [
        { id: 1, nombreUsuario: 'Luis', activo: true },
        { id: 2, nombreUsuario: 'Ana', activo: true },
      ]
      prismaMock.usuario.findMany.mockResolvedValue(usuariosMock)
  
      const result = await usuarioResolvers.Query.usuarios(
        {},
        {},
        context as any
      )
      expect(result).toEqual(usuariosMock)
    })
  
    it('Obtener usuario por id', async () => {
      const usuarioMock = { id: 1, nombreUsuario: 'Luis', activo: true }
      prismaMock.usuario.findFirst.mockResolvedValue(usuarioMock)
  
      const result = await usuarioResolvers.Query.usuario(
        {},
        { id: 1 },
        context as any
      )
      expect(result).toEqual(usuarioMock)
    })
  })

})

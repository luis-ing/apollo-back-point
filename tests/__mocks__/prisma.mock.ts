import { vi } from 'vitest'

export const prismaMock = {
  usuario: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
  categoria: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
}

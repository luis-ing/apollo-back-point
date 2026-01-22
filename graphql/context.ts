import { prisma } from '../lib/prisma.js'
import { validateToken, type TokenPayload } from './auth/validateToken.js';

export interface Context {
  prisma: typeof prisma;
  user?: TokenPayload | null;
}

const PUBLIC_OPERATIONS = [
  'LoginUsuario',
  'RegistrarUsuario',
];

export const createContext = async ({ req }: any): Promise<Context> => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  // Obtener nombre de la operación
  const operationName =
    req.body?.operationName ||
    req.body?.query?.match(/(query|mutation)\s+(\w+)/)?.[2];

  // Excluir operaciones públicas
  // Si las operaciones no requieren autenticación, no añadimos el usuario al contexto
  if (PUBLIC_OPERATIONS.includes(operationName)) {
    return { prisma };
  }

  const user = validateToken(token);

  if (!user) {
    throw new Error('No autorizado: token inválido o expirado');
  }
  
  return {
    prisma,
    user
  };
}

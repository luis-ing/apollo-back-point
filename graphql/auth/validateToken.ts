import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: number;
  email: string;
}

export const validateToken = (token?: string): TokenPayload | null => {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.SECURITY_KEY!) as TokenPayload;
  } catch (error) {
    return null;
  }
};

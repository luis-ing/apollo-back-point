import type { ResolverFn } from '../types.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const usuarioResolvers = {
    Query: {
        usuarios: (async (_p, _a, { prisma }) => {
            try {
                return await prisma.usuario.findMany({
                    where: { activo: true },
                })
            }
            catch (error) {
                return [];
            }
        }) satisfies ResolverFn,
        usuario: (async (_p, args, { prisma }) => {
            const { id } = args
            return await prisma.usuario.findFirst({
                where: { id, activo: true },
            })
        }) satisfies ResolverFn,
        LoginUsuario: (async (_p, args, { prisma }) => {
            try{
                const { email, password } = args
                const user = await prisma.usuario.findFirst({where: { email, activo: true }
                });

                if (!user) {
                    return { STATUS: 401, message: "El usuario no existentes." };
                }
                const checkPassword = await bcrypt.compare(password, user.contrasena);
                if (!checkPassword) {
                    return { STATUS: 401, message: "Contraseña incorrecta." };
                }
                const token = jwt.sign({ id: user.id, email: email }, process.env.SECURITY_KEY!, { expiresIn: '8h' });
                const userData = {
                    id: user.id,
                    email: email,
                    nombreUsuario: user.nombreUsuario,
                    imgURL: user.imgURL,
                    temaOscuro: user.temaOscuro
                };
                return { STATUS: 200, message: "Sesión iniciada correctamente", data: userData, token: token };
            }
            catch(error){
                return { STATUS: 500, message: `Error: ${error}` };
            }
        }) satisfies ResolverFn,
    },
}
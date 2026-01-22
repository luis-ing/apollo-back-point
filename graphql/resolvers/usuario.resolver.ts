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
        Login: (async (_p, args, { prisma }) => {
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
        RegisterUser: (async (_p, args, { prisma }) => {
            try {
                const { nombreUsuario, email, contrasena } = args;
                const findUser = await prisma.usuario.findFirst({
                    where: {
                        email,
                        activo: true
                    }
                });

                if (findUser) {
                    return { STATUS: 400, message: "El correo ya fue registrado." };
                }

                const passHash = await bcrypt.hash(contrasena, 10);

                await prisma.$transaction(async (tx) => {

                    const infoUser = await tx.usuario.create({
                        data: {
                            nombreUsuario: nombreUsuario, email: email, contrasena: passHash
                        },
                    });

                    const cuentaInfo = await tx.cuentas.create({
                        data: {
                            nombre: "Principal", usuarioCreador_id: infoUser.id
                        },
                    });

                    await tx.cuentasusuario.create({
                        data: {
                            cuentas_id: cuentaInfo.id, usuario_id: infoUser.id, invitacionAceptada: true
                        },
                    });

                });

                return { STATUS: 200, message: "Usuario registrado correctamente" };
            } catch (error) {
                console.log("Error ", error);
                return { STATUS: 400, message: error };
            } finally {
                await prisma.$disconnect();
            }
        }) satisfies ResolverFn,
    },
}
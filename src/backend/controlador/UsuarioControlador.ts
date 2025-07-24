import { Request, Response } from 'express';
import UsuarioModelo from '../modelo/UsuarioModelo';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt';

class UsuarioControlador {
    async obtenerTodos(req: Request, res: Response) {
        try {
            const usuarios = await UsuarioModelo.obtenerTodas();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    async obtenerPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const usuario = await UsuarioModelo.obtenerPorId(id);
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuario' });
        }
    }

    async registrar(req: Request, res: Response) {
        try {
            const nuevoUsuario = await UsuarioModelo.crear(req.body);
            res.status(201).json({
                message: 'Registro exitoso',
                data: nuevoUsuario
            });
        } catch (error: any) {
            if (error.message === 'Ya existe un usuario activo con esta cédula') {
                res.status(400).json({ error: error.message });
            } else {
                console.error('Error SQL:', error.message);
                res.status(500).json({ error: 'Error al registrar usuario' });
            }
        }
    }

    async modificar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const usuarioModificado = await UsuarioModelo.actualizar(id, req.body);
            res.status(201).json({
                message: 'Modificado exitosamente',
                data: usuarioModificado
            });
        } catch (error: any) {
            if (error.message === 'Ya existe un usuario activo con esta cédula') {
                res.status(400).json({ error: error.message });
            } else {
                console.error('Error SQL:', error);
                res.status(500).json({ error: 'Error al modificar usuario' });
            }
        }
    }

    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await UsuarioModelo.eliminar(id);
            res.json({ message: 'Usuario eliminado con éxito' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ error: 'Error al eliminar usuario' });
        }
    }

    // Método para login
    async login(req: Request, res: Response) {
        const { nombre, contraseña } = req.body;

        try {
            const usuario = await UsuarioModelo.obtenerPorNombre(nombre);

            if (!usuario) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
            if (!validPassword) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            const payload = {
                id: usuario.id,
                nombre: usuario.nombre,
                tipousuario: usuario.tipousuario,
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

            res.json({
                message: 'Login exitoso',
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    tipousuario: usuario.tipousuario,
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error interno en login' });
        }
    }
}

export default new UsuarioControlador();

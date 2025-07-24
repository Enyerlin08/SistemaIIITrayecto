import { Request, Response } from 'express';
import PersonaModelo from '../modelo/PersonaModelo';

class PersonaControlador {
    async obtenerTodas(req: Request, res: Response) {
        try {
            const personas = await PersonaModelo.obtenerTodas();
            res.json(personas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener personas' });
        }
    }

    async obtenerPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const persona = await PersonaModelo.obtenerPorId(id);
            if (persona) {
                res.json(persona);
            } else {
                res.status(404).json({ error: 'Persona no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener persona' });
        }
    }

    async registrar(req: Request, res: Response) {
        try {
            const nuevaPersona = await PersonaModelo.crear(req.body);
            // Devolver un mensaje de éxito junto con los datos de la nueva persona
            res.status(201).json({
                message: 'Registro exitoso',
                data: nuevaPersona
            });
        } catch (error: any) {
            // Manejar errores específicos
            if (error.message === 'Ya existe una persona activa con esta cédula') {
                res.status(400).json({ error: error.message });
            } else {
                // Error genérico (por ejemplo, problemas de base de datos)
                console.error('Error SQL:', error);
                res.status(500).json({ error: 'Error al registrar persona' });
            }
        }
    }

    async modificar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const personaModificada = await PersonaModelo.actualizar(id, req.body);
            res.status(201).json(personaModificada);
        } catch (error: any) {
            if (error.message === 'Ya existe una persona activa con esta cédula') {
                // Devolver un error 400 con un mensaje específico
                res.status(400).json({ error: error.message });
            } else {
            console.error('Error SQL:', error);
            res.status(500).json({ error: 'Error al modificar persona' });
            }
        }
    }

    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
    
            // Eliminar la persona (cambiar estado a 'I')
            await PersonaModelo.eliminar(id);
    
            // Devolver un mensaje de éxito
            res.json({ message: 'Persona eliminada con éxito' });
        } catch (error) {
            console.error('Error al eliminar persona:', error);
            res.status(500).json({ error: 'Error al eliminar persona' });
        }
    }
}

export default new PersonaControlador();
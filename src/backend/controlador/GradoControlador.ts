import { Request, Response } from "express";
import GradoModelo from "../modelo/GradoModelo";

class GradoControlador {
    async registrarGrado(req: Request, res: Response) {
        try {
            const { nombre } = req.body;
            const resultado = await GradoModelo.registrarGrado(nombre);
            res.status(201).json(resultado);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear ' });
        }
    }

    async seleccionarGrados(req: Request, res: Response) {
        try {
            const resultado = await GradoModelo.seleccionarGrados();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los grados' });
        }
    }

    // Obtener  por ID
    async seleccionarGradoPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const resultado = await GradoModelo.seleccionarGradoPorId(id);
            if (resultado) {
                res.json(resultado);
            } else {
                res.status(404).json({ error: 'grado no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el grado' });
        }
    }

    // Actualizar 
    async actualizarGrado(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { nombre } = req.body;
            const resultado = await GradoModelo.actualizarGrado(id, nombre);
            if (resultado) {
                res.status(200).json(resultado);
            } else {
                res.status(404).json({ error: ' no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar ' });
        }
    }

    // Eliminar 
    async eliminarGrado(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const resultado = await GradoModelo.eliminarGrado(id);
            if (resultado) {
                res.json({ mensaje: 'Grado eliminado correctamente' });
            } else {
                res.status(404).json({ error: 'grado no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar' });
        }
    }
}

export default new GradoControlador();
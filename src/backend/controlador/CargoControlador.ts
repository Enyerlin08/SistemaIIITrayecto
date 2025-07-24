import { Request, Response } from "express";
import CargoModelo from "../modelo/CargoModelo";

class CargoControlador {
    // Registrar un nuevo cargo
    async registrarCargo(req: Request, res: Response) {
        try {
            const { nombre } = req.body;
            const resultado = await CargoModelo.registrarCargo(nombre);
            res.status(201).json(resultado);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el cargo' });
        }
    }

    // Obtener todos los cargos
    async seleccionarCargos(req: Request, res: Response) {
        try {
            const resultado = await CargoModelo.seleccionarCargos();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los cargos' });
        }
    }

    // Obtener un cargo por ID
    async seleccionarCargoPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const resultado = await CargoModelo.seleccionarCargoPorId(id);
            if (resultado) {
                res.json(resultado);
            } else {
                res.status(404).json({ error: 'Cargo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el cargo' });
        }
    }

    // Actualizar un cargo
    async actualizarCargo(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { nombre } = req.body;
            const resultado = await CargoModelo.actualizarCargo(id, nombre);
            if (resultado) {
                res.status(200).json(resultado);
            } else {
                res.status(404).json({ error: 'Cargo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el cargo' });
        }
    }

    // Eliminar un cargo
    async eliminarCargo(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const resultado = await CargoModelo.eliminarCargo(id);
            if (resultado) {
                res.json({ mensaje: 'Cargo eliminado correctamente' });
            } else {
                res.status(404).json({ error: 'Cargo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el cargo' });
        }
    }
}

export default new CargoControlador();
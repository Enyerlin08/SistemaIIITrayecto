import { Request, Response } from "express";
import PlatoModelo from "../modelo/PlatoModelo";

class PlatoControlador {
    // Registrar un nuevo plato con ingredientes
async registrarPlato(req: Request, res: Response) {
  try {
    const { nombre, descripcion, ingredientes } = req.body;
    const resultado = await PlatoModelo.registrarPlato(nombre, descripcion, ingredientes);
    res.status(201).json(resultado);
  } catch (error: any) {
    console.error('Error al registrar el plato:', error);

    // Si es un error de PostgreSQL
    if (error.code && error.detail) {
      res.status(500).json({
        error: 'Error al registrar el plato',
        code: error.code,
        detail: error.detail,
        hint: error.hint,
        position: error.position,
        message: error.message,
      });
    } else if (error instanceof Error) {
      // Error genérico de JS
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error desconocido al registrar el plato' });
    }
  }
}


    // Obtener todos los platos
async seleccionarPlatos(req: Request, res: Response) {
    try {
        const resultado = await PlatoModelo.seleccionarPlatos();
        res.json(resultado);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error al seleccionar platos:', error); // <-- Aquí verás detalles del error
            res.status(500).json({ error: error.message || 'Error al obtener los platos' });
        } else {
            console.error('Error desconocido al seleccionar platos:', error);
            res.status(500).json({ error: 'Error desconocido al obtener los platos' });
        }
    }
}

async obtenerPlatosDisponibles(req: Request, res: Response) {
        try {
            const resultado = await PlatoModelo.seleccionarPlatos();
            console.log('Platos disponibles:', resultado); // Depuración
            res.json(resultado);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error al obtener platos disponibles:', error);
                res.status(500).json({ error: error.message || 'Error al obtener los platos disponibles' });
            } else {
                console.error('Error desconocido al obtener platos disponibles:', error);
                res.status(500).json({ error: 'Error desconocido al obtener los platos disponibles' });
            }
        }
    }


    // Obtener un plato por ID
    async seleccionarPlatoPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const resultado = await PlatoModelo.seleccionarPlatoPorId(id);
            if (resultado) {
                res.json(resultado);
            } else {
                res.status(404).json({ error: 'Plato no encontrado' });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message || 'Error al obtener el plato' });
            } else {
                res.status(500).json({ error: 'Error desconocido al obtener el plato' });
            }
        }
    }

    // Actualizar un plato con ingredientes
    async actualizarPlato(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { nombre, descripcion, ingredientes } = req.body;
            const resultado = await PlatoModelo.actualizarPlato(id, nombre, descripcion, ingredientes);
            if (resultado) {
                res.status(200).json(resultado);
            } else {
                res.status(404).json({ error: 'Plato no encontrado' });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message || 'Error al actualizar el plato' });
            } else {
                res.status(500).json({ error: 'Error desconocido al actualizar el plato' });
            }
        }
    }

    // Eliminar un plato
    async eliminarPlato(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const resultado = await PlatoModelo.eliminarPlato(id);
            if (resultado) {
                res.json({ mensaje: 'Plato eliminado correctamente' });
            } else {
                res.status(404).json({ error: 'Plato no encontrado' });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ error: 'Error al eliminar el plato' });
            } else {
                res.status(500).json({ error: 'Error desconocido al eliminar el plato' });
            }
        }
    }

    // Obtener productos disponibles
async obtenerProductosDisponibles(req: Request, res: Response) {
    try {
        const resultado = await PlatoModelo.obtenerProductosDisponibles();
        console.log('Productos obtenidos exitosamente:', resultado); // Log para confirmar datos obtenidos
        res.json(resultado);
    } catch (error: unknown) {
        console.error('Error en obtenerProductosDisponibles:', {
            message: error instanceof Error ? error.message : 'Error desconocido',
            stack: error instanceof Error ? error.stack : undefined,
            error: error
        });
        if (error instanceof Error) {
            res.status(500).json({ error: error.message || 'Error al obtener los productos disponibles' });
        } else {
            res.status(500).json({ error: 'Error desconocido al obtener los productos disponibles' });
        }
    }
}
}

export default new PlatoControlador();
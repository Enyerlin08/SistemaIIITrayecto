import { Request, Response } from 'express';
import MenuModelo from '../modelo/MenuModelo';
import PlatoModelo from '../modelo/PlatoModelo'; // Asumiendo que existe

class MenuControlador {
async crearMenu(req: Request, res: Response) {
    try {
      const { nombre, platos } = req.body;
      const resultado = await MenuModelo.crearMenu(nombre, platos);
      res.status(201).json(resultado);
    } catch (error: any) {
      console.error('Error al registrar el menú:', error);
      if (error.code && error.detail) {
        res.status(500).json({
          error: 'Error al registrar el menú',
          code: error.code,
          detail: error.detail,
          hint: error.hint,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error desconocido al registrar el menú' });
      }
    }
  }

  async obtenerMenusDisponibles(req: Request, res: Response) {
    try {
      const menus = await MenuModelo.obtenerMenusDisponibles();
      res.status(200).json(menus);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerMaximaCantidadMenu(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const menu = await MenuModelo.obtenerMaximaCantidadMenu(parseInt(id));
      if (!menu) return res.status(404).json({ error: 'Menú no encontrado' });
      res.status(200).json(menu);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async prepararMenu(req: Request, res: Response) {
    const { id } = req.params;
    const { cantidad } = req.body;
    try {
      const menu = await MenuModelo.obtenerMaximaCantidadMenu(parseInt(id));
      if (!menu) return res.status(404).json({ error: 'Menú no encontrado' });
      if (cantidad > menu.maxima_cantidad) {
        return res.status(400).json({ error: 'Cantidad supera el stock disponible' });
      }
      await MenuModelo.descontarIngredientes(parseInt(id), cantidad);
      res.status(200).json({ message: `Preparados ${cantidad} menús`, maxima_cantidad: menu.maxima_cantidad - cantidad });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async eliminarMenu(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const resultado = await MenuModelo.eliminarMenu(id);
      if (resultado) {
        res.json({ mensaje: 'Menú eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Menú no encontrado' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message || 'Error al eliminar el menú' });
      } else {
        res.status(500).json({ error: 'Error desconocido al eliminar el menú' });
      }
    }
  }
}

export default new MenuControlador();
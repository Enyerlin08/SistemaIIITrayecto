import { Request, Response } from 'express';
import ProductoModelo from '../modelo/ProductoModelo';

class ProductoControlador {
  async obtenerTodos(req: Request, res: Response) {
    try {
      const productos = await ProductoModelo.obtenerTodos();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const producto = await ProductoModelo.obtenerPorId(id);
      if (producto) {
        res.json(producto);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener producto' });
    }
  }

  async registrar(req: Request, res: Response) {
    try {
      const foto = req.file?.filename || null;

      const data = {
        ...req.body,
        foto,
      };

      const nuevoProducto = await ProductoModelo.crear(data);
      res.status(201).json({
        message: 'Registro exitoso',
        data: nuevoProducto
      });
    } catch (error: any) {
      console.error('Error al registrar producto:', error);
      res.status(500).json({ error: 'Error al registrar producto' });
    }
  }

  async modificar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const foto = req.file?.filename || req.body.foto;

      const data = {
        ...req.body,
        foto,
      };

      const productoModificado = await ProductoModelo.actualizar(id, data);
      res.status(201).json({
        message: 'Modificado exitosamente',
        data: productoModificado
      });
    } catch (error: any) {
      console.error('Error SQL:', error);
      res.status(500).json({ error: 'Error al modificar producto' });
    }
  }

  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await ProductoModelo.eliminar(id);
      res.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }
}

export default new ProductoControlador();

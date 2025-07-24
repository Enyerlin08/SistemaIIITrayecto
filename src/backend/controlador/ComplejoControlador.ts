import { Request, Response } from 'express';
import ComplejoModelo from '../modelo/ComplejoModelo';

class ComplejoControlador {
  async obtenerTodos(req: Request, res: Response) {
    try {
      const complejos = await ComplejoModelo.obtenerTodos();
      res.json(complejos);
    } catch (error) {
      console.error('Error al obtener complejos:', error);
      res.status(500).json({ error: 'Error al obtener complejos educativos' });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const complejo = await ComplejoModelo.obtenerPorId(id);
      if (complejo) {
        res.json(complejo);
      } else {
        res.status(404).json({ error: 'Complejo educativo no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener complejo educativo por ID:', error);
      res.status(500).json({ error: 'Error al obtener complejo educativo' });
    }
  }

  async registrar(req: Request, res: Response) {
    try {
      const { nombre, codigo } = req.body;

      // Validación simple para asegurarse de que los campos requeridos están presentes
      if (!nombre || !codigo) {
        return res.status(400).json({ error: 'El nombre y código son requeridos' });
      }

      const nuevoComplejo = await ComplejoModelo.crear(req.body);
      res.status(201).json({
        message: 'Registro exitoso',
        data: nuevoComplejo,
      });
    } catch (error: any) {
      // Verificamos si el error es específico y lo tratamos
      if (error.message === 'Ya existe un complejo educativo con este código') {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Error al registrar complejo educativo:', error);
        res.status(500).json({ error: 'Error al registrar complejo educativo' });
      }
    }
  }

  async modificar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { nombre, codigo } = req.body;

      // Validación simple para asegurarse de que los campos requeridos están presentes
      if (!nombre || !codigo) {
        return res.status(400).json({ error: 'El nombre y código son requeridos' });
      }

      const complejoModificado = await ComplejoModelo.actualizar(id, req.body);
      if (complejoModificado) {
        res.status(200).json({
          message: 'Modificado exitosamente',
          data: complejoModificado,
        });
      } else {
        res.status(404).json({ error: 'Complejo educativo no encontrado' });
      }
    } catch (error: any) {
      if (error.message === 'Ya existe un complejo educativo con este código') {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Error al modificar complejo educativo:', error);
        res.status(500).json({ error: 'Error al modificar complejo educativo' });
      }
    }
  }

  async eliminar(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);

        // Eliminar(cambiar estado a 'I')
        await ComplejoModelo.eliminar(id);

        // Devolver un mensaje de éxito
        res.json({ message: 'Complejo eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar complejo:', error);
        res.status(500).json({ error: 'Error al eliminar complejo' });
    }
}
 
    }
 

export default new ComplejoControlador();
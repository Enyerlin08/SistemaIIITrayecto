import { Router } from 'express';
import MenuControlador from '../controlador/MenuControlado';

const router = Router();

router.post('/registrar', MenuControlador.crearMenu);
router.get('/disponibles', MenuControlador.obtenerMenusDisponibles);
router.get('/maxima-cantidad/:id', MenuControlador.obtenerMaximaCantidadMenu);
router.post('/preparar/:id', MenuControlador.prepararMenu);
router.delete('/eliminar/:id', MenuControlador.eliminarMenu);

export default router;
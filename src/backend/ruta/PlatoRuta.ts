import express from 'express';
import PlatoControlador from '../controlador/PlatoControlador';

const router = express.Router();

router.get('/productos-disponibles', PlatoControlador.obtenerProductosDisponibles);
router.get('/disponibles', PlatoControlador.obtenerPlatosDisponibles); // Nuevo endpoint
router.get('/', PlatoControlador.seleccionarPlatos);
router.get('/:id', PlatoControlador.seleccionarPlatoPorId);
router.post('/registrar', PlatoControlador.registrarPlato);
router.put('/modificar/:id', PlatoControlador.actualizarPlato);
router.delete('/eliminar/:id', PlatoControlador.eliminarPlato);

export default router;
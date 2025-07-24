import express from 'express';
import PersonaControlador from '../controlador/PersonaControlador';

const router = express.Router();

router.get('/', PersonaControlador.obtenerTodas);
router.get('/:id', PersonaControlador.obtenerPorId);
router.post('/registrar', PersonaControlador.registrar);
router.put('/modificar/:id', PersonaControlador.modificar);
router.delete('/eliminar/:id', PersonaControlador.eliminar);

export default router;
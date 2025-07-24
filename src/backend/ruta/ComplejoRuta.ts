import express from 'express';
import ComplejoControlador from '../controlador/ComplejoControlador';

const router = express.Router();

router.get('/', ComplejoControlador.obtenerTodos);
router.get('/:id', ComplejoControlador.obtenerPorId);
router.post('/registrar', ComplejoControlador.registrar);
router.put('/modificar/:id', ComplejoControlador.modificar);
router.delete('/eliminar/:id', ComplejoControlador.eliminar);

export default router;

import express from 'express';
import GradoControlador from '../controlador/GradoControlador';

const router = express.Router();

router.get('/', GradoControlador.seleccionarGrados);
router.get('/:id', GradoControlador.seleccionarGradoPorId);
router.post('/registrar', GradoControlador.registrarGrado);
router.put('/modificar/:id', GradoControlador.actualizarGrado);
router.delete('/eliminar/:id', GradoControlador.eliminarGrado);

export default router;


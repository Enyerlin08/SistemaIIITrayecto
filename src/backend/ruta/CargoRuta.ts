import express from 'express';
import CargoControlador from '../controlador/CargoControlador';

const router = express.Router();

router.get('/', CargoControlador.seleccionarCargos);
router.get('/:id', CargoControlador.seleccionarCargoPorId);
router.post('/registrar', CargoControlador.registrarCargo);
router.put('/modificar/:id', CargoControlador.actualizarCargo);
router.delete('/eliminar/:id', CargoControlador.eliminarCargo);

export default router;
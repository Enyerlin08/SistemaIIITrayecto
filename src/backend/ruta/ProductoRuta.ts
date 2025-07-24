import express from 'express';
import ProductoControlador from '../controlador/ProductoControlador';
import upload from '../servicio/upload';

const router = express.Router();

router.get('/', ProductoControlador.obtenerTodos);
router.get('/:id', ProductoControlador.obtenerPorId);
router.post('/registrar', upload.single('foto'), ProductoControlador.registrar);
router.put('/modificar/:id', upload.single('foto'), ProductoControlador.modificar);
router.delete('/eliminar/:id', ProductoControlador.eliminar);

export default router;

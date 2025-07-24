import express from 'express';
import UsuarioControlador from '../controlador/UsuarioControlador';

const router = express.Router();

router.get('/', UsuarioControlador.obtenerTodos);
router.get('/:id', UsuarioControlador.obtenerPorId);
router.post('/registrar', UsuarioControlador.registrar);
router.put('/modificar/:id', UsuarioControlador.modificar);
router.delete('/eliminar/:id', UsuarioControlador.eliminar);

// Ruta para login
router.post('/login', UsuarioControlador.login);

export default router;

import express from 'express';
import UsuarioControlador from '../controlador/UsuarioControlador';

const router = express.Router();

router.post('/', UsuarioControlador.login);

export default router;

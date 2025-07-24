import express from "express"; //Importar express (servidor)
import TipoControlador from "../controlador/TipoControlador"; //importar controlador

const router = express.Router();

router.get('/', TipoControlador.obtenerTipos); //Obtener todos los grupos
router.get('/:id', TipoControlador.seleccionarTipo); //Obtener los grupos según ID
router.post('/registrar', TipoControlador.registrarTipo); //Registrar Tipo
router.put('/actualizar/:id', TipoControlador.actualizarTipo); //Modificar Tipo Según la ID
router.delete('/eliminar/:id', TipoControlador.eliminarTipo); //Eliminar Tipo según la ID

export default router; //Exportación
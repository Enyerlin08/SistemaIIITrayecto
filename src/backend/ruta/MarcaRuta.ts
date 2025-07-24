import express from "express"; //Importar express (servidor)
import MarcaControlador from "../controlador/MarcaControlador"; //importar controlador

const router = express.Router();

router.get('/', MarcaControlador.obtenerMarcas); //Obtener todos los grupos
router.get('/:id', MarcaControlador.seleccionarMarca); //Obtener los grupos según ID
router.post('/registrar', MarcaControlador.registrarMarca); //Registrar Grupo
router.put('/actualizar/:id', MarcaControlador.actualizarMarca); //Modificar Grupo Según la ID
router.delete('/eliminar/:id', MarcaControlador.eliminarMarca); //Eliminar Grupo según la ID

export default router; //Exportación
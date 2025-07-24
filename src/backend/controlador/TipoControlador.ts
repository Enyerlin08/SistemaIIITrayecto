import { Request, Response } from "express"; //importar el express (Servidor)
import TipoModelo from "../modelo/TipoModelo"; //Importar el modelo

class TipoControlador { //Nombre de la clase del controlador

    //Funcion para Consultar todos los tipos
    async obtenerTipos(req: Request, res: Response){
        try {
            const result = await TipoModelo.obtenerTipo();
            res.json(result);
        }  catch (error) {
            res.status(500).json({error: 'Error al obtener la información del tipo'});
        }
    }

    //funcion para registrar un tipo
    async registrarTipo(req: Request, res: Response) {
        try {
            const { nombre } = req.body;
            const result = await TipoModelo.registrarTipo(nombre);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error al Registrar el tipo'});
        }
    }

    //función para modificar un tipo
    async actualizarTipo(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const {nombre} = req.body;
            const result = await TipoModelo.actualizarTipo(id, nombre);
            if (result){
                res.status(201).json(result);
            } else {
                res.status(404).json({error: 'Tipo no encontrado'});
            }
        } catch (error){
            res.status(500).json({error: 'Error al actualizar el tipo'});
        }
    }

    //función para obtener un tipo mediante la id
    async seleccionarTipo(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await TipoModelo.seleccionarTipo(id);
            if (result) {
                res.json(result);
            } else {
                res.status(404).json ({error: 'Tipo no encontrado'});
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al Obtener el tipo'});
        }
    }

    //función para eliminar un tipo según la ID
    async eliminarTipo(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await TipoModelo.eliminarTipo(id);
            if (result){
                res.json(result);
            } else {
                res.status(404).json ({error: 'Tipo no encontrado'});
            }
        } catch (error) {
            res.status(500).json({error: 'Error al eliminar el tipo'});
        }
        
    }
}

export default new TipoControlador(); //Exportar
import { Request, Response } from "express"; //importar el express (Servidor)
import MarcaModelo from "../modelo/MarcaModelo"; //Importar el modelo

class MarcaControlador { //Nombre de la clase del controlador

    //Funcion para Consultar todos los grupos
    async obtenerMarcas(req: Request, res: Response){
        try {
            const result = await MarcaModelo.obtenerMarcas();
            res.json(result);
        }  catch (error) {
            res.status(500).json({error: 'Error al obtener la información de las marcas'});
        }
    }

    //funcion para registrar un grupo
    async registrarMarca(req: Request, res: Response) {
        try {
            const { nombre } = req.body;
            const result = await MarcaModelo.registrarMarca(nombre);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error al Registrar la marca'});
        }
    }

    //función para modificar un grupo
    async actualizarMarca(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const {nombre} = req.body;
            const result = await MarcaModelo.actualizarMarca(id, nombre);
            if (result){
                res.status(201).json(result);
            } else {
                res.status(404).json({error: 'Marca no encontrado'});
            }
        } catch (error){
            res.status(500).json({error: 'Error al actualizar la marca'});
        }
    }

    //función para obtener un grupo mediante la id
    async seleccionarMarca(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await MarcaModelo.seleccionarMarca(id);
            if (result) {
                res.json(result);
            } else {
                res.status(404).json ({error: 'Marca no encontrado'});
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al Obtener la Marca'});
        }
    }

    //función para eliminar un grupo según la ID
    async eliminarMarca(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await MarcaModelo.eliminarMarca(id);
            if (result){
                res.json(result);
            } else {
                res.status(404).json ({error: 'Marca no encontrada'});
            }
        } catch (error) {
            res.status(500).json({error: 'Error al eliminar la marca'});
        }
        
    }
}

export default new MarcaControlador(); //Exportar
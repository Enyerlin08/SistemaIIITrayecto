import pool from '../config/database'; //Importar la conexión con la base de datos

class MarcaModelo { //Linea en donde se declara la clase

//Registro de Grupo
    async registrarMarca(nombre:string){
        const result = await pool.query('INSERT INTO marca (nombre,status) VALUES ($1,$2) RETURNING *', [nombre,'A']);
        return result.rows[0];
    }

//Funcion encargada de consultar todos los grupos a excepción de los inhabilitados
    async obtenerMarcas() {
        const result = await pool.query ('SELECT * FROM marca WHERE status != $1', ['I']);
        return result.rows;
    }

//funcion para consultar según ID
    async seleccionarMarca(id: number) {
        const result = await pool.query('SELECT * FROM marca WHERE id = $1', [id]);
        return result.rows[0];
    }
//funcion para modificar el grupo seleccionado según la ID
    async actualizarMarca(id:number, nombre:string) {
        const result = await pool.query ('UPDATE marca SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
        return result.rows[0];
    }

//función para eliminar grupo por su id (se modifica el estado a inhabilitado "I")
    async eliminarMarca (id: number) {
        const result = await pool.query('UPDATE marca SET status = $1 WHERE id = $2 RETURNING *', ['I', id]);
        return result.rows[0];
    }
}

export default new MarcaModelo(); //Exportar el archivo para su posterior utilización
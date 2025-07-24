import pool from '../config/database'; //Importar la conexión con la base de datos

class TipoModelo { //Linea en donde se declara la clase

//Registro de tipo
    async registrarTipo(nombre:string){
        const result = await pool.query('INSERT INTO tipo (nombre,status) VALUES ($1,$2) RETURNING *', [nombre,'A']);
        return result.rows[0];
    }

//Funcion encargada de consultar todos los grupos a excepción de los inhabilitados
    async obtenerTipo() {
        const result = await pool.query ('SELECT * FROM tipo WHERE status != $1', ['I']);
        return result.rows;
    }

//funcion para consultar según ID
    async seleccionarTipo(id: number) {
        const result = await pool.query('SELECT * FROM tipo WHERE id = $1', [id]);
        return result.rows[0];
    }
//funcion para modificar el tipo seleccionado según la ID
    async actualizarTipo(id:number, nombre:string) {
        const result = await pool.query ('UPDATE tipo SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
        return result.rows[0];
    }

//función para eliminar tipo por su id (se modifica el estado a inhabilitado "I")
    async eliminarTipo (id: number) {
        const result = await pool.query('UPDATE tipo SET status = $1 WHERE id = $2 RETURNING *', ['I', id]);
        return result.rows[0];
    }
}

export default new TipoModelo(); //Exportar el archivo para su posterior utilización
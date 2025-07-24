import pool from '../config/database';

class GradoModelo {
    async registrarGrado(nombre: string) {
        const result = await pool.query(`
            INSERT INTO grado
                (nombre, status) 
            VALUES 
                ($1, $2) 
            RETURNING *
        `, [nombre, 'A']);
        return result.rows[0];
    }

    async seleccionarGrados() {
        const result = await pool.query(`
            SELECT *
            FROM grado
            WHERE status != $1
            ORDER BY id DESC
        `, ['I']);
        return result.rows;
    }

    // Función para obtener por su ID
    async seleccionarGradoPorId(id: number) {
        const result = await pool.query(`
            SELECT *
            FROM grado
            WHERE id = $1 AND status != 'I'
        `, [id]);
        return result.rows[0];
    }

    // Función para actualizar 
    async actualizarGrado(id: number, nombre: string) {
        const result = await pool.query(`
            UPDATE grado
            SET nombre = $1
            WHERE id = $2 AND status != 'I'
            RETURNING *
        `, [nombre, id]);
        return result.rows[0];
    }

    // Función para "eliminar" 
    async eliminarGrado(id: number) {
        const result = await pool.query(`
            UPDATE grado
            SET status = $1
            WHERE id = $2
            RETURNING *
        `, ['I', id]);
        return result.rows[0];
    }
}

export default new GradoModelo();


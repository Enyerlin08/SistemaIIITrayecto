import pool from '../config/database';

class CargoModelo {
    // Función para registrar un cargo
    async registrarCargo(nombre: string) {
        const result = await pool.query(`
            INSERT INTO cargo
                (nombre, status) 
            VALUES 
                ($1, $2) 
            RETURNING *
        `, [nombre, 'A']);
        return result.rows[0];
    }

    // Función para obtener todos los cargos activos (status != 'I')
    async seleccionarCargos() {
        const result = await pool.query(`
            SELECT *
            FROM cargo
            WHERE status != $1
            ORDER BY id DESC
        `, ['I']);
        return result.rows;
    }

    // Función para obtener un cargo por su ID
    async seleccionarCargoPorId(id: number) {
        const result = await pool.query(`
            SELECT *
            FROM cargo
            WHERE id = $1 AND status != 'I'
        `, [id]);
        return result.rows[0];
    }

    // Función para actualizar un cargo
    async actualizarCargo(id: number, nombre: string) {
        const result = await pool.query(`
            UPDATE cargo
            SET nombre = $1
            WHERE id = $2 AND status != 'I'
            RETURNING *
        `, [nombre, id]);
        return result.rows[0];
    }

    // Función para "eliminar" (desactivar) un cargo (cambio de status a 'I')
    async eliminarCargo(id: number) {
        const result = await pool.query(`
            UPDATE cargo
            SET status = $1
            WHERE id = $2
            RETURNING *
        `, ['I', id]);
        return result.rows[0];
    }
}

export default new CargoModelo();
import pool from '../config/database';

class PersonaModelo {
    // Función para obtener todas las personas activas (status = 'A')
    static async obtenerTodas() {
        // Ejecuta una consulta SQL que selecciona todas las filas donde el campo 'status' es igual a 'A' (activas)
        const result = await pool.query(`
            SELECT 
              persona.id AS "idPersona", 
              persona.cedula, 
              persona.nombre AS "nombrePersona", 
              persona.apellido, 
              persona.status AS estadoPersona, 
              cargo.nombre AS "nombreCargo", 
              cargo.status AS estadoCargo 
            FROM persona 
            JOIN cargo ON persona."idCargo" = cargo.id
            WHERE persona.status = 'A';
          `);
        return result.rows;
    }

    // Función para obtener una persona por su ID
    static async obtenerPorId(id: number) {
        // Ejecuta una consulta SQL que selecciona una persona por su ID y que esté activa (status = 'A')
        const result = await pool.query('SELECT * FROM persona WHERE id = $1 AND status = $2', [id, 'A']);
        // Devuelve la primera fila encontrada, que sería la persona con ese ID
        return result.rows[0];
    }

    // Función para crear una nueva persona
    static async crear(data: any) {
        // Extraemos las propiedades de 'data' para obtener los valores de la persona
        const { cedula, nombre, apellido, idCargo } = data;

        // Verificamos si ya existe una persona con la misma cédula y estatus 'A' (activa)
        const existePersonaActiva = await pool.query(
            'SELECT * FROM persona WHERE cedula = $1 AND status = $2',
            [cedula, 'A']
        );

        // Si ya existe una persona activa con esa cédula, lanzamos un error
        if (existePersonaActiva.rows.length > 0) {
            throw new Error('Ya existe una persona activa con esta cédula');
        }

        // Si no existe, realizamos la inserción de la nueva persona en la base de datos
        const result = await pool.query(`
            INSERT INTO persona (
                cedula, nombre, apellido, status, "idCargo"
            ) VALUES (
                $1, $2, $3, $4, $5
            ) RETURNING *`,
            [
                cedula, nombre, apellido, 'A', idCargo
            ]
        );
        // Retorna la nueva persona insertada (devolviendo la fila recién creada)
        return result.rows[0];
    }

    // Función para actualizar los datos de una persona existente
    static async actualizar(id: number, data: any) {
        // Extraemos las propiedades de 'data' para obtener los valores de la persona
        const { cedula, nombre, apellido, idCargo } = data;
        const result = await pool.query(`
            UPDATE persona SET
                cedula = $2,
                nombre = $3,
                apellido = $4,
                "idCargo" = $5
            WHERE id = $1
            RETURNING *`,
            [
                id, cedula, nombre, apellido, idCargo
            ]
        );
        // Retorna la persona actualizada (devolviendo la fila modificada)
        return result.rows[0];
    }

    // Función para eliminar (inactivar) a una persona, cambiando su status a 'I' (inactiva)
    static async eliminar(id: number) {
        // Ejecuta una consulta SQL para actualizar el campo 'status' a 'I' (inactivo) de la persona con el ID proporcionado
        await pool.query('UPDATE persona SET status = $1 WHERE id = $2', ['I', id]);
    }
}

export default PersonaModelo;

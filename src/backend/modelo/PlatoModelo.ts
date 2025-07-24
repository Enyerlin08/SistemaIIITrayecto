import pool from '../config/database';

interface Ingrediente {
  id_producto: number;
  cantidad: number;
}

class PlatoModelo {
    // Registrar un nuevo plato con ingredientes
    async registrarPlato(nombre: string, descripcion: string, ingredientes: Ingrediente[]) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insertar el plato
            const platoResult = await client.query(`
                INSERT INTO plato (nombre, descripcion, status)
                VALUES ($1, $2, 'Activo')
                RETURNING *
            `, [nombre, descripcion || null]);

            const platoId = platoResult.rows[0].id;

            // Insertar los ingredientes en plato_ingrediente
            for (const ingrediente of ingredientes) {
                await client.query(`
                    INSERT INTO plato_ingrediente (id_plato, id_producto, cantidad)
                    VALUES ($1, $2, $3)
                `, [platoId, ingrediente.id_producto, ingrediente.cantidad]);
            }

            await client.query('COMMIT');
            return platoResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Obtener todos los platos activos con sus ingredientes
    async seleccionarPlatos() {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.nombre AS nombre,
      p.descripcion AS descripcion,
      COALESCE(
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'id_producto', pi.id_producto,
            'nombre_producto', pr.nombre,
            'cantidad', pi.cantidad
          )
        ) FILTER (WHERE pi.id IS NOT NULL), 
        '{}'
      ) AS ingredientes
    FROM plato p
    LEFT JOIN plato_ingrediente pi ON p.id = pi.id_plato
    LEFT JOIN producto pr ON pi.id_producto = pr.id AND pr.status = 'A'
    WHERE p.status != 'Inactivo'
    GROUP BY p.id
    ORDER BY p.id DESC
  `);
  return result.rows;
}


    // Obtener un plato por su ID con sus ingredientes
    async seleccionarPlatoPorId(id: number) {
        const result = await pool.query(`
            SELECT p.*, 
                   COALESCE(
                       ARRAY_AGG(
                           JSON_BUILD_OBJECT(
                               'id_producto', pi.id_producto,
                               'nombre_producto', pr.nombre,
                               'cantidad', pi.cantidad
                           )
                       ) FILTER (WHERE pi.id IS NOT NULL), 
                       '{}'
                   ) AS ingredientes
            FROM plato p
            LEFT JOIN plato_ingrediente pi ON p.id = pi.id_plato AND pi.status = 'Activo'
            LEFT JOIN producto pr ON pi.id_producto = pr.id AND pr.status = 'Activo'
            WHERE p.id = $1 AND p.status != 'Inactivo'
            GROUP BY p.id
        `, [id]);
        return result.rows[0];
    }

    // Actualizar un plato con sus ingredientes
    async actualizarPlato(id: number, nombre: string, descripcion: string, ingredientes: Ingrediente[]) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Actualizar el plato
            const platoResult = await client.query(`
                UPDATE plato
                SET nombre = $1, descripcion = $2
                WHERE id = $3 AND status != 'Inactivo'
                RETURNING *
            `, [nombre, descripcion || null, id]);

            if (!platoResult.rows[0]) {
                throw new Error('Plato no encontrado');
            }

            // Desactivar ingredientes existentes
            await client.query(`
                UPDATE plato_ingrediente
                SET status = 'Inactivo'
                WHERE id_plato = $1 AND status = 'Activo'
            `, [id]);

            // Insertar nuevos ingredientes
            for (const ingrediente of ingredientes) {
                await client.query(`
                    INSERT INTO plato_ingrediente (id_plato, id_producto, cantidad, status)
                    VALUES ($1, $2, $3, 'Activo')
                `, [id, ingrediente.id_producto, ingrediente.cantidad]);
            }

            await client.query('COMMIT');
            return platoResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Eliminar (desactivar) un plato y sus ingredientes
    async eliminarPlato(id: number) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Desactivar el plato
            const platoResult = await client.query(`
                UPDATE plato
                SET status = 'Inactivo'
                WHERE id = $1
                RETURNING *
            `, [id]);

            // Desactivar los ingredientes asociados
            await client.query(`
                UPDATE plato_ingrediente
                SET status = 'Inactivo'
                WHERE id_plato = $1
            `, [id]);

            await client.query('COMMIT');
            return platoResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Obtener productos disponibles
async obtenerProductosDisponibles() {
    const result = await pool.query(`
        SELECT id, nombre, kilogramo, fechavencimiento
        FROM producto
        WHERE status = 'A' AND fechavencimiento >= CURRENT_DATE
        ORDER BY nombre ASC
    `);
    return result.rows;
}
}

export default new PlatoModelo();
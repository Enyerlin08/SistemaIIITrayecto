import pool from '../config/database';

class ComplejoModelo {
  // Obtener todos los complejos con datos de la persona asociada (si la hay)
  static async obtenerTodos() {
    const result = await pool.query(`
      SELECT 
        complejoeducativo.id AS "idComplejo",
        complejoeducativo.nombre,
        complejoeducativo.codigo,
        complejoeducativo.asistenciaestudiante,
        complejoeducativo.fecha,
        complejoeducativo.status,
        persona.id AS "idPersona",
        persona.nombre AS "nombrePersona",
        persona.apellido
      FROM complejoeducativo
      LEFT JOIN persona ON complejoeducativo."idPersona" = persona.id
      WHERE complejoeducativo.status = 'A'
      ORDER BY complejoeducativo.id DESC;
    `);
    return result.rows;
  }
  // Obtener un complejo educativo por ID
  static async obtenerPorId(id: number) {
    const result = await pool.query(`
      SELECT 
        complejoeducativo.*, 
        persona.nombre AS "nombrePersona", 
        persona.apellido 
      FROM complejoeducativo
      LEFT JOIN persona ON complejoeducativo."idPersona" = persona.id
      WHERE complejoeducativo.id = $1 AND complejoeducativo.status = 'A'
    `, [id]);
    return result.rows[0];
  }

  // Crear nuevo complejo educativo
  static async crear(data: any) {
    const { nombre, codigo, asistenciaestudiante, fecha, idPersona } = data;

    const result = await pool.query(`
      INSERT INTO complejoeducativo (
        nombre, codigo, asistenciaestudiante, fecha, status, "idPersona"
      ) VALUES (
        $1, $2, $3, $4, 'A', $5
      ) RETURNING *
    `, [nombre, codigo, asistenciaestudiante, fecha, idPersona]);

    return result.rows[0];
  }

  // Actualizar un complejo educativo
  static async actualizar(id: number, data: any) {
    const { nombre, codigo, asistenciaestudiante, fecha, idPersona } = data;

    const result = await pool.query(`
      UPDATE complejoeducativo SET
        nombre = $2,
        codigo = $3,
        asistenciaestudiante = $4,
        fecha = $5,
        "idPersona" = $6
      WHERE id = $1
      RETURNING *
    `, [id, nombre, codigo, asistenciaestudiante, fecha, idPersona]);

    return result.rows[0];
  }

  // Eliminar (inactivar) complejo educativo
  static async eliminar(id: number) {
    await pool.query(
      'UPDATE complejoeducativo SET status = $1 WHERE id = $2',
      ['I', id]
    );
  }
}

export default ComplejoModelo;
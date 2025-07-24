import pool from '../config/database';

class ProductoModelo {
  static async obtenerTodos() {
    const result = await pool.query(`
      SELECT 
        producto.id AS "idProducto", 
        producto.nombre AS "nombreProducto", 
        producto.kilogramo, 
        producto.fechavencimiento, 
        producto.foto, 
        tipo.nombre AS "nombreTipo", 
        tipo.status AS estatusTipo,
        marca.nombre AS "nombreMarca",
        marca.status AS estatusMarca
      FROM producto
      JOIN tipo ON producto."idTipo" = tipo.id
      JOIN marca ON producto."idMarca" = marca.id
      WHERE producto.status = 'A'
    `);
    return result.rows;
  }

  static async obtenerPorId(id: number) {
    const result = await pool.query('SELECT * FROM producto WHERE id = $1 AND status = $2', [id, 'A']);
    return result.rows[0];
  }

  static async crear(data: any) {
    const { nombre, kilogramo, fechavencimiento, foto, idTipo, idMarca } = data;

    const result = await pool.query(`
      INSERT INTO producto (
        nombre, kilogramo, fechavencimiento, foto, status, "idTipo", "idMarca"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *`,
      [
        nombre, kilogramo, fechavencimiento, foto, 'A', idTipo, idMarca
      ]
    );
    return result.rows[0];
  }

  static async actualizar(id: number, data: any) {
    const { nombre, kilogramo, fechavencimiento, foto, idTipo, idMarca } = data;

    const result = await pool.query(`
      UPDATE producto SET
        nombre = $1,
        kilogramo = $2,
        fechavencimiento = $3,
        foto = $4,
        "idTipo" = $5,
        "idMarca" = $6
      WHERE id = $7
      RETURNING *`,
      [
        nombre, kilogramo, fechavencimiento, foto, idTipo, idMarca, id
      ]
    );
    return result.rows[0];
  }

  static async eliminar(id: number) {
    await pool.query('UPDATE producto SET status = $1 WHERE id = $2', ['I', id]);
  }
}

export default ProductoModelo;

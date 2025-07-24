import pool from "../config/database";

interface PlatoMenu {
  idPlato: number;
}

class MenuModelo {
  async crearMenu(nombre: string, platos: PlatoMenu[]) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insertar el menú
      const menuResult = await client.query(
        `INSERT INTO menu (nombre, status, fecha) VALUES ($1, 'Activo', CURRENT_DATE) RETURNING *`,
        [nombre]
      );
      const menuId = menuResult.rows[0].id;

      // Asociar los platos al menú en menu_plato
      for (const plato of platos) {
        await client.query(
          `INSERT INTO menu_plato (id_menu, id_plato, status) VALUES ($1, $2, 'Activo')`,
          [menuId, plato.idPlato]
        );
      }

      await client.query('COMMIT');
      return menuResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async obtenerMenusDisponibles() {
    const result = await pool.query(
      `SELECT m.id, m.nombre, m.status, 
              COALESCE(
                ARRAY_AGG(
                  JSON_BUILD_OBJECT(
                    'id_plato', mp.id_plato,
                    'nombre_plato', p.nombre,
                    'descripcion', p.descripcion
                  )
                ) FILTER (WHERE mp.id IS NOT NULL), 
                '{}'
              ) AS platos
       FROM menu m
       LEFT JOIN menu_plato mp ON m.id = mp.id_menu AND mp.status = 'Activo'
       LEFT JOIN plato p ON mp.id_plato = p.id AND p.status = 'Activo'
       WHERE m.status = 'Activo'
       GROUP BY m.id, m.nombre, m.status`
    );
    return result.rows;
  }

  async obtenerMaximaCantidadMenu(idMenu: number) {
    const result = await pool.query(
      `SELECT m.id, m.nombre,
              (SELECT MIN((p.kilogramo / pi.cantidad)::INTEGER)
               FROM menu_plato mp
               JOIN plato_ingrediente pi ON mp.id_plato = pi.id_plato
               JOIN producto p ON pi.id_producto = p.id
               WHERE mp.id_menu = m.id AND p.status = 'A' AND p.kilogramo > 0) AS maxima_cantidad
       FROM menu m
       WHERE m.id = $1 AND m.status = 'Activo'`,
      [idMenu]
    );
    return result.rows[0];
  }

  async descontarIngredientes(idMenu: number, cantidad: number) {
    await pool.query(
      `UPDATE producto p
       SET kilogramo = p.kilogramo - (pi.cantidad * $2)
       FROM menu_plato mp
       JOIN plato_ingrediente pi ON mp.id_plato = pi.id_plato
       WHERE mp.id_menu = $1 AND pi.id_producto = p.id AND p.status = 'A' AND p.kilogramo >= (pi.cantidad * $2)`,
      [idMenu, cantidad]
    );
  }

  async eliminarMenu(idMenu: number) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Desactivar el menú
      const menuResult = await client.query(
        `UPDATE menu
         SET status = 'Inactivo'
         WHERE id = $1 AND status = 'Activo'
         RETURNING *`,
        [idMenu]
      );

      if (!menuResult.rows[0]) {
        throw new Error('Menú no encontrado');
      }

      // Desactivar las relaciones en menu_plato
      await client.query(
        `UPDATE menu_plato
         SET status = 'Inactivo'
         WHERE id_menu = $1`,
        [idMenu]
      );

      await client.query('COMMIT');
      return menuResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new MenuModelo();
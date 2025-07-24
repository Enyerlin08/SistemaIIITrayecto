import pool from '../config/database';
import bcrypt from 'bcrypt';

class UsuarioModelo {
    // Obtener todos los usuarios activos
    static async obtenerTodas() {
        const result = await pool.query(`
            SELECT 
            usuario.id AS "idUsuario",
            usuario.nombre AS "nombreUsuario",
            usuario.tipousuario,
            persona.nombre AS "nombrePersona",
            persona.apellido
            FROM usuario
            JOIN persona ON usuario."idPersona" = persona.id
            WHERE usuario.status = 'A'
        `);

        return result.rows;
    }

    // Obtener usuario por ID
    static async obtenerPorId(id: number) {
        const result = await pool.query(
            'SELECT * FROM usuario WHERE id = $1 AND status = $2',
            [id, 'A']
        );
        return result.rows[0];
    }

    // Obtener usuario por nombre (para login)
    static async obtenerPorNombre(nombre: string) {
        const result = await pool.query(
            'SELECT * FROM usuario WHERE nombre = $1 AND status = $2',
            [nombre, 'A']
        );
        return result.rows[0];
    }

    // Crear usuario con contraseña hasheada
static async crear(data: any) {
    const { nombre, contraseña, tipousuario, idPersona } = data;

    const existeUsuarioPorPersona = await pool.query(
        'SELECT * FROM usuario WHERE "idPersona" = $1 AND status = $2',
        [idPersona, 'A']
    );

    if (existeUsuarioPorPersona.rows.length > 0) {
        throw new Error('Ya existe un usuario activo con esta cédula');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const result = await pool.query(`
        INSERT INTO usuario (
            nombre, contraseña, tipousuario, status, "idPersona"
        ) VALUES (
            $1, $2, $3, $4, $5
        ) RETURNING *`,
        [
            nombre, hashedPassword, tipousuario, 'A', idPersona
        ]
    );
    return result.rows[0];
}

    // Actualizar usuario (sin hashear la contraseña aquí, si quieres cambiarla hay que hacer una función aparte)
    static async actualizar(id: number, data: any) {
        const { nombre, contraseña, tipousuario, idPersona } = data;

        const existeUsuarioActivo = await pool.query(
            'SELECT * FROM usuario WHERE nombre = $1 AND status = $2 AND id != $3',
            [nombre, 'A', id]
        );

        if (existeUsuarioActivo.rows.length > 0) {
            throw new Error('Ya existe un usuario activo con esta cédula');
        }

        const result = await pool.query(`
            UPDATE usuario SET
                nombre = $2,
                tipousuario = $3,
                "idPersona" = $4
            WHERE id = $1
            RETURNING *`,
            [
                id, nombre, tipousuario, idPersona
            ]
        );
        return result.rows[0];
    }

    // Eliminar usuario (cambiar status a 'I')
    static async eliminar(id: number) {
        await pool.query('UPDATE usuario SET status = $1 WHERE id = $2', ['I', id]);
    }
}

export default UsuarioModelo;

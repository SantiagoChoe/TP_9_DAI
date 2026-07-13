import config from '../config/dbconfig.js';
import pkg from 'pg';
import LogHelper from '../helpers/logHelper.js';
const { Client } = pkg;

export default class UserService {
    getProfilePosts = async (userId) => {
        const client = new Client(config);
        try {
            await client.connect();
            
            const userSql = `SELECT id, nombre_usuario , nombre_completo , email, password, biografia , foto_perfil FROM "usuario" WHERE id = $1`;
            const userResult = await client.query(userSql, [userId]);
            
            if (userResult.rows.length === 0) return null;
            const user = userResult.rows[0];

            const postsSql = `SELECT id, url_imagen, descripcion, likes, fecha_creacion, usuariod_id FROM "publicacion" WHERE usuariod_id = $1`;
            const postsResult = await client.query(postsSql, [userId]);

            await client.end();

            return {
                ...user,
                publications: postsResult.rows
            };
        } catch (error) {
            LogHelper.logError(error);
            error.message = `Error al obtener las publicaciones del perfil: ${error.message}`;
            throw error;
        }
    }

    updateUser = async (userId, data) => {
        const client = new Client(config);
        const { nombre_completo, biografia, foto_perfil } = data;
        try {
            await client.connect();
            const sql = `
                UPDATE "usuario" SET nombre_completo = COALESCE($1, nombre_completo), 
                    biografia = COALESCE($2, biografia), 
                    foto_perfil = COALESCE($3, foto_perfil)
                WHERE id = $4
                RETURNING id, nombre_usuario, nombre_completo, email, foto_perfil, biografia;
            `;
            const result = await client.query(sql, [nombre_completo, biografia, foto_perfil, userId]);
            await client.end();
            return result.rows[0];
        } catch (error) {
            LogHelper.logError(error);
            error.message = `Error al actualizar el perfil del usuario: ${error.message}`;
            throw error;
        }
    }
}
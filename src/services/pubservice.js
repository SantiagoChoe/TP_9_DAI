import config from '../config/db.js';
import pkg from 'pg';
const { Client } = pkg;

export default class PostService {
    getAllPosts = async () => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `
                SELECT p.id, p.usuariod_id, p.url_imagen, p.descripcion, p.likes, p.fecha_creacion, u.username, u.pfp AS user_pfp
                FROM "publicacion" p
                JOIN "usuario" u ON p.usuariod_id = u.id
                ORDER BY p.fecha_creacion DESC;
            `;
            
            const result = await client.query(sql);
            await client.end();
            
            return result.rows;
        } catch (error) {
            error.message = `Error al obtener todas las publicaciones: ${error.message}`;
            throw error;
        }
    }
    createPost = async (postData) => {
        const client = new Client(config);
        const { url_imagen, descripcion, usuariod_id } = postData;
        try {
            await client.connect();
            
            const sql = `
                INSERT INTO "publicacion" (url_imagen, descripcion, likes, fecha_creacion, usuariod_id)
                VALUES ($1, $2, 0, NOW(), $3)
                RETURNING id, url_imagen, descripcion, likes, fecha_creacion, usuariod_id;
            `;
            
            const values = [url_imagen, descripcion, usuariod_id];
            const result = await client.query(sql, values);
            await client.end();
            
            return result.rows[0];
        } catch (error) {
            error.message = `Error al crear la publicación: ${error.message}`;
            throw error;
        }
    }
}
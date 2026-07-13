import e from 'express';
import config from '../config/dbconfig.js';
import pkg from 'pg'
const { Client, Pool } = pkg;

export default class AuthService {
    getUserAsync = async (nombre_usuario) => {
        let returnArray = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT * FROM "usuario" WHERE nombre_usuario = $1`;
            const result = await client.query(sql, [nombre_usuario]);
            await client.end();
            returnArray = (result.rows && result.rows.length > 0) ? result.rows[0] : null;
        } catch (error) {
            error.message = `Error al obtener el usuario por nombre de usuario: ${error.message}`;
        }
        return returnArray;
    }

    valUserExist = async (nombre_usuario, email) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT id FROM "usuario" WHERE nombre_usuario = $1 OR email = $2`;
            const result = await client.query(sql, [nombre_usuario, email]);
            await client.end();
            return result.rowCount > 0;
        } catch (error) {
            error.message = `Error al verificar la existencia del usuario: ${error.message}`;
            throw error; 
        }
    }

    createAsync = async (userData) => {
        const client = new Client(config);
        const { nombre_usuario , nombre_completo , email, password, biografia , foto_perfil  } = userData; 
        try {
            await client.connect();
            const sql = `
                INSERT INTO "usuario" (nombre_usuario , nombre_completo , email, password, biografia , foto_perfil)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, username, email; 
            `;
            const values = [nombre_usuario , nombre_completo , email, password, biografia , foto_perfil];
            const result = await client.query(sql, values);
            await client.end();
            return result.rows[0];

        } catch (error) {
            error.message = `Error al crear el usuario: ${error.message}`;
            throw error;
        }
    }
}
import { Router } from 'express';
import jwt from "jsonwebtoken"
import verifyToken from "../middlewares/verifyToken.js";
import UserService from '../services/userservice.js';
const router = Router();
const svc = new UserService();


router.get('/perfil', verifyToken, async (req, res) => {
  /*  #swagger.tags   = ['Usuarios']
      #swagger.summary = 'Obtiene la información del perfil del usuario autenticado'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = {
        description: 'Información del perfil',
        schema: { $ref: '#/definitions/Perfil' }
      }
  */
  try {
    const userId = req.user.id; 
    
    const profileData = await svc.getProfilePosts(userId);
    if (!profileData) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json(profileData);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

router.put('/perfil', verifyToken, async (req, res) => {
  /*  #swagger.tags   = ['Usuarios']
      #swagger.summary = 'Actualiza todos los datos del usuario autenticado'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Nuevos datos del usuario',
        required: true,
        schema: { $ref: '#/definitions/UsuarioInput' }
      }
      #swagger.responses[200] = { description: 'Usuario actualizado' }
      #swagger.responses[404] = { description: 'Usuario no encontrado' }
  */
  try {
    const userId = req.user.id;
    const { nombre_completo, biografia, foto_perfil } = req.body;

    const updatedUser = await svc.updateUser(userId, { nombre_completo, biografia, foto_perfil });
    return res.status(200).json({ 
        message: 'Perfil actualizado con éxito', 
        user: updatedUser 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
});


export default router;
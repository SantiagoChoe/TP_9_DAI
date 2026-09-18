import { Router } from 'express';
import PubService from '../services/pubservice.js';
import verifyToken from "../middlewares/verifyToken.js";
import { valPost } from "../middlewares/valPost.js";
const router = Router();
const svc = new PubService();

router.get("/", async (req, res) => {
  /*  #swagger.tags   = ['Publicaciones']
      #swagger.summary = 'Obtiene la lista completa de publicaciones'
      #swagger.responses[200] = {
        description: 'Lista de publicaciones',
        schema: { $ref: '#/definitions/Publicacion' }
      }
  */
  try {
    const posts = await svc.getAllPostsAsync();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor al obtener las publicaciones' });
  }
})

router.post("/", verifyToken, valPost, async (req, res) => {
  /*  #swagger.tags   = ['Publicaciones']
      #swagger.summary = 'Crea una nueva publicación'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la publicación a crear',
        required: true,
        schema: { $ref: '#/definitions/PublicacionInput' }
      }
      #swagger.responses[201] = { description: 'Publicación creada exitosamente' }
      #swagger.responses[400] = { description: 'Datos inválidos' }
      #swagger.responses[401] = { description: 'Token inválido o ausente' }
  */
  try {
    const { url_imagen, descripcion } = req.body;
    const usuariod_id = req.user.id; 
    const newPost = await svc.createPostAsync({ url_imagen, descripcion, usuariod_id });
    
    return res.status(201).json({ 
        message: 'Publicación creada con éxito', 
        post: newPost 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor al crear la publicación' });
  }
});

export default router;
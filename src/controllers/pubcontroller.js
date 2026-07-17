import { Router } from 'express';
import PubService from '../services/pubservice.js';
import verifyToken from "../middlewares/verifyToken.js";
import { valPost } from "../middlewares/valPost.js";
const router = Router();
const svc = new PubService();

router.get("/", async (req, res) => {
  try {
    const posts = await svc.getAllPostsAsync();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor al obtener las publicaciones' });
  }
})

router.post("/", verifyToken, valPost, async (req, res) => {
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

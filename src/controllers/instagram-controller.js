import { Router } from 'express';
import instagramService from '../services/instagramService.js';
const router = Router();
const svc = new instagramService();



router.post('/Registro', async (req, res) => {
  let respuesta;
  const error = await svc.createAsync(req.body);
  if (error == null) {
    respuesta = res.status(201).json();
  } else {
    respuesta = res.status(400).send(error);
  }
  return respuesta;
})



export default router;

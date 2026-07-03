import { Router } from 'express';
import jwt from "jsonwebtoken"
import PubService from '../services/pubservice.js';
const router = Router();
const svc = new PubService();

router.post('/registro', async (req, res) => {
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

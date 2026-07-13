import { Router } from 'express';
import jwt from "jsonwebtoken"
import { verifyToken } from "../middlewares/verifyToken.js";
import UserService from '../services/userservice.js';
const router = Router();
const svc = new UserService();




router.get('/perfil ', verifyToken, async (req, res) => {
  res.json({ message: 'Ruta protegida accedida', user: req.user });
});


export default router;

import { Router } from 'express';
import jwt from "jsonwebtoken"
import AuthService from '../services/authservice.js';
const router = Router();
const svc = new AuthService();

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

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validación de usuario (esto es solo un ejemplo, normalmente validarías contra una base de datos)
  if (username === 'user' && password === 'password') {
    // Datos del payload del token
    const payload = {
      username: username,
      role: 'user'
    };

    // Generación del token
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Envío del token al cliente
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

export default router;

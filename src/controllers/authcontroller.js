import { Router } from 'express';
import jwt from "jsonwebtoken"
import AuthService from '../services/authservice.js';
import { validateUser } from "../middlewares/valUser.js";
import { validateRegister } from '../middlewares/valRegister.js';

const router = Router();
const svc = new AuthService();

const SECRET_KEY = process.env.JWT_SECRET; 

router.post('/registro', validateRegister, async (req, res) => {
  const { nombre_usuario , nombre_completo , email, password, biografia , foto_perfil } = req.body;
  try {
    const userExists = await svc.valUserExist(nombre_usuario, email);
    if (userExists) {
      return res.status(400).json({ error: 'El nombre de usuario o el correo electrónico ya están en uso' });
    }

    const error = await svc.createAsync(req.body);
    if (error == null) {
      return res.status(201).json({ 
          message: 'Usuario registrado con éxito', 
          user: createdUser 
      });
    } else {
      return res.status(400).send(error);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/login', validateUser, async (req, res) => {
  const { nombre_usuario, password } = req.body;

  try { 
    const user = await authService.getUserAsync(nombre_usuario);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (nombre_usuario === user.nombre_usuario && password === user.password) {
      
      const payload = {
        id: user.id,
        username: user.username,
        password: user.password,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

      return res.status(200).json({ 
        message: 'Login successful', 
        token: `Bearer ${token}`, 
        user 
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;

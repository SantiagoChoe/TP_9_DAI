import { Router } from 'express';
import jwt from "jsonwebtoken"
import AuthService from '../services/authservice.js';
import { validateUser } from "../middlewares/valUser.js";
import { validateRegister } from '../middlewares/valRegister.js';
import bcrypt from "bcrypt";

const router = Router();
const svc = new AuthService();

const SECRET_KEY = process.env.JWT_SECRET; 

router.post('/registro', validateRegister, async (req, res) => {
  /*  #swagger.tags   = ['Auth']
      #swagger.summary = 'Crea un nuevo usuario'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del usuario a crear',
        required: true,
        schema: { $ref: '#/definitions/UsuarioInput' }
      }
      #swagger.responses[201] = { description: 'Usuario creado exitosamente' }
      #swagger.responses[400] = { description: 'Datos inválidos' }
  */
  const { nombre_usuario , nombre_completo , email, password, biografia , foto_perfil } = req.body;
  
  try {
    const userExists = await svc.valUserExist(nombre_usuario, email);
    if (userExists) {
      return res.status(400).json({ error: 'El nombre de usuario o el correo electrónico ya están en uso' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await svc.createAsync({
      ...req.body,
      password: hashedPassword
    });

    return res.status(201).json({ 
        message: 'Usuario registrado con éxito', 
        user: nuevoUsuario.nombre_usuario,
        user_completo: nombre_completo,
        email: nuevoUsuario.email,
        bio: biografia,
        image: foto_perfil 
    });
  } catch (error) {
    console.error("Error original:", error); // Revisa la terminal de Node
      res.status(500).json({ 
        message: 'Error interno del servidor', 
        detalle: error.message // Te devolverá la causa exacta en Swagger/Postman
      }); 
    }
});

router.post('/login', validateUser, async (req, res) => {
  /*  #swagger.tags   = ['Auth']
      #swagger.summary = 'Inicia sesión como usuario'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del usuario para iniciar sesión',
        required: true,
        schema: { $ref: '#/definitions/UsuarioInput' }
      }
      #swagger.responses[200] = { description: 'Inicio de sesión exitoso' }
      #swagger.responses[401] = { description: 'Credenciales inválidas' }
  */
  const { nombre_usuario, password } = req.body;

  try { 
    const user = await svc.getUserAsync(nombre_usuario);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordCorrecta = await bcrypt.compare(password, user.password);

    if (nombre_usuario === user.nombre_usuario && passwordCorrecta) {
      
      const payload = {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
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

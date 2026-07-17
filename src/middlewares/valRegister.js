import { validaString } from "../helpers/valHelpers.js";

export const validateRegister = (req, res, next) => {
    const { nombre_usuario , nombre_completo, email, password } = req.body;
    
    if (!validaString(nombre_usuario) || !validaString(nombre_completo) || !validaString(email) || !validaString(password)) {
        return res.status(400).json({ error: 'Faltan campos obligatorios o son inválidos' });
    }

    next();
};
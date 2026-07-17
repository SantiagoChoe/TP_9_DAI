import { validaString } from "../helpers/valHelpers.js";

export const validateUser = (req, res, next) => {
    const { nombre_usuario , password } = req.body;
    
    if (!validaString(nombre_usuario) || !validaString(password)) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    next();
};
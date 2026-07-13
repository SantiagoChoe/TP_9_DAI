import { validaString } from "../helpers/valHelpers.js";

export const validateRegister = (req, res, next) => {
    const { username, fullname, email, password } = req.body;
    
    if (!validaString(username) || !validaString(fullname) || !validaString(email) || !validaString(password)) {
        return res.status(400).json({ error: 'Faltan campos obligatorios o son inválidos' });
    }

    next();
};
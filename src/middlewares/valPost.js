import { validaString } from "../helpers/valHelpers.js";

export const valPost = (req, res, next) => {
    const { url_imagen } = req.body;

    if (!validaString(url_imagen)) {
        return res.status(400).json({ error: "La URL de la imagen (url_imagen) es obligatoria." });
    }
    next();
};
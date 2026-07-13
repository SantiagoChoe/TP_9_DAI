import { validaString } from "../helpers/valHelpers.js";

export const validatePost = (req, res, next) => {
    const { url_image } = req.body;

    if (!validaString(url_image)) {
        return res.status(400).json({ error: "La URL de la imagen (url_image) es obligatoria." });
    }
    next();
};
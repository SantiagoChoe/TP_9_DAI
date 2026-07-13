import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET; 

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }

            req.user = decoded;
            next();
        });
    } else {
        return res.status(403).json({ message: 'Token requerido' });
    }
};

export default verifyToken;
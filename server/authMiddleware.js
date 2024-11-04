import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Función auxiliar para extraer el token del encabezado
const getTokenFromHeaders = (req) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1]; // Retorna solo el token sin "Bearer"
    }
    return null;
};

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = getTokenFromHeaders(req);
    if (!token) return res.status(403).json({ message: 'Token requerido' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: 'Token no válido' });
        req.user = user; // Almacena los datos del usuario en la solicitud
        next();
    });
};

// Middleware para verificar el rol de administrador
const adminMiddleware = (req, res, next) => {
    const token = getTokenFromHeaders(req);
    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado: Token requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token no válido' });
        }

        // Verifica si el rol es 'admin'
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado: Requiere rol de administrador' });
        }

        req.userId = decoded.id; // Guarda el ID del usuario en la solicitud para uso posterior
        next();
    });
};

export { verifyToken, adminMiddleware, getTokenFromHeaders };

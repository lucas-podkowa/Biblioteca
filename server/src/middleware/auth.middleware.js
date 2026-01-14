import jwt from "jsonwebtoken";

/**
 * Middleware para verificar que el usuario está autenticado
 * Valida el token JWT del header Authorization
 */
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        // El token viene como "Bearer <token>"
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader;

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Agregar información del usuario al request
        req.user = {
            id: decoded.id,
            rol: decoded.rol,
            nombre: decoded.nombre,
            mail: decoded.suCorreo
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token inválido" });
        }
        return res.status(500).json({ message: "Error al verificar token" });
    }
};

/**
 * Middleware para verificar que el usuario tiene el rol requerido
 * @param  {...number} roles - IDs de roles permitidos (1=Admin, 2=Bibliotecario, 3=Lector)
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                message: "No tiene permisos para realizar esta acción"
            });
        }

        next();
    };
};

/**
 * Middleware opcional para verificar token si existe
 * Útil para rutas que funcionan tanto para usuarios autenticados como públicos
 */
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            // Sin token, continuar como usuario público
            req.user = null;
            return next();
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader;

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = {
            id: decoded.id,
            rol: decoded.rol,
            nombre: decoded.nombre,
            mail: decoded.suCorreo
        };

        next();
    } catch (error) {
        // Token inválido, continuar como usuario público
        req.user = null;
        next();
    }
};

// Constantes de roles para mejor legibilidad
export const ROLES = {
    ADMIN: 1,
    BIBLIOTECARIO: 2,
    LECTOR: 3
};

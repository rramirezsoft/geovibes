const { handleHttpError } = require("../utils/handleError");
const { 
    verifyAccessToken, 
    verifyRefreshToken, 
    getRefreshToken
} = require("../utils/handleJwt");
const User = require("../models/nosql/user");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Verificar si hay token en la cabecera
        const token = authHeader.split(' ').pop();
        if (!authHeader || !token || token === "undefined") {
            handleHttpError(res, "NOT_TOKEN", 401);
            return; 
        }
    
        // Verificar el Access Token
        const dataToken = verifyAccessToken(token);
        if (dataToken && dataToken._id) {
            const user = await User.findById(dataToken._id);
            if (user) {
                if (!user.emailVerified) {
                    if (req.url.includes('/validate') || req.url.includes('/resend-code')) {
                        req.user = user;
                        return next();  // Permite continuar al endpoint de verificación de correo
                    }
                    return handleHttpError(res, "EMAIL_NOT_VERIFIED", 403);
                }
                req.user = user;
                return next();
            }
        }

        // Si el token no es válido o expiró
        handleHttpError(res, "NOT_AUTHORIZED", 401);

    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        handleHttpError(res, "NOT_SESSION", 401);
    }
};

const refreshAuthMiddleware = async (req, res, next) => {
    try {
        console.log('Cookies:', req.cookies);
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return handleHttpError(res, "NO_REFRESH_TOKEN_PROVIDED", 401);
        }

        // Verificar el Refresh Token
        const dataRefreshToken = verifyRefreshToken(refreshToken);
        if (!dataRefreshToken || !dataRefreshToken._id) {
            return handleHttpError(res, "INVALID_REFRESH_TOKEN", 401);
        }

        // Validar que el Refresh Token sea válido en Redis
        const storedToken = await getRefreshToken(dataRefreshToken._id);
        if (storedToken !== refreshToken) {
            return handleHttpError(res, "REFRESH_TOKEN_MISMATCH", 401);
        }

        // Obtener el usuario
        const user = await User.findById(dataRefreshToken._id);
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        req.user = user;
        next();
        
    } catch (err) {
        console.error("❌ Error en refreshAuthMiddleware:", err.message);
        handleHttpError(res, "NOT_SESSION", err.status || 500);
    }
};

module.exports = { authMiddleware, refreshAuthMiddleware };


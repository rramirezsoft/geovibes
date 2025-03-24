const { handleHttpError } = require("../utils/handleError");
const { 
    verifyAccessToken, 
    verifyRefreshToken, 
    getRefreshToken, 
    generateAccessToken 
} = require("../utils/handleJwt");
const User = require("../models/nosql/user");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const refreshTokenCookie = req.cookies?.refreshToken;

        // Verificar si hay token en la cabecera
        if (!authHeader) {
            handleHttpError(res, "NOT_TOKEN", 401);
            return;
        }

        // Extraer el token de la cabecera
        const token = authHeader.split(' ').pop();
        if (!token) {
            handleHttpError(res, "NOT_TOKEN", 401);
            return;
        }

        // Verificar el Access Token
        const dataToken = verifyAccessToken(token);
        if (dataToken && dataToken._id) {
            const user = await User.findById(dataToken._id);
            if (user) {
                if (!user.emailVerified) {
                    if (req.url.includes('/validate')) {
                        req.user = user;
                        return next();  // Permite continuar al endpoint de verificación de correo
                    }

                    return handleHttpError(res, "EMAIL_NOT_VERIFIED", 403);  // Bloqueamos el acceso a otros endpoints
                }
                req.user = user;
                return next();
            }
        }

        // Si el Access Token no es válido, intentamos con el Refresh Token
        if (refreshTokenCookie) {
            const dataRefreshToken = verifyRefreshToken(refreshTokenCookie);
            
            if (dataRefreshToken && dataRefreshToken._id) {
                const storedToken = await getRefreshToken(dataRefreshToken._id);
                
                if (storedToken === refreshTokenCookie) {
                    // Generar un nuevo Access Token y actualizar el header
                    const newAccessToken = generateAccessToken({ _id: dataRefreshToken._id });
                    req.headers.authorization = `Bearer ${newAccessToken}`;

                    const user = await User.findById(dataRefreshToken._id);
                    if (user) { 
                        if (!user.emailVerified) {return handleHttpError(res, "EMAIL_NOT_VERIFIED", 403);}
                        req.user = user;
                        return next();
                    }
                }
            }
        }

        // Si ninguno de los tokens es válido
        handleHttpError(res, "NOT_AUTHORIZED", 401);

    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        handleHttpError(res, "NOT_SESSION", 401);
    }
};

module.exports = authMiddleware;


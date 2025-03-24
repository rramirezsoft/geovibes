const { handleHttpError } = require("../utils/handleError")
const { verifyToken } = require("../utils/handleJwt")
const User = require("../models/nosql/user")

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            handleHttpError(res, "NOT_TOKEN", 401);
            return;
        }

        // Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
        const token = req.headers.authorization.split(' ').pop();

        if (!token) {
            handleHttpError(res, "NOT_TOKEN", 401);
            return;
        }

        // Verifica el token
        const dataToken = await verifyToken(token);
        if (!dataToken._id) {
            handleHttpError(res, "ERROR_ID_TOKEN", 401);
            return;
        }

        // Encuentra al usuario con el ID extraído del token
        const user = await User.findById(dataToken._id);
        if (!user) {
            handleHttpError(res, "USER_NOT_FOUND", 404);
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        handleHttpError(res, "NOT_SESSION", 401);
    }
}

module.exports = authMiddleware;

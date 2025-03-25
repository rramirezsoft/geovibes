const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");
const { 
    registerUser, 
    verifyUserCode, 
    loginUser, 
    forgotPassword, 
    resetPassword,
    refreshTokenService,
    logoutUser } = require("../services/auth");

const registerCtrl = async (req, res) => {
    try {
        const cleanData = matchedData(req);
        const data = await registerUser(cleanData);
        res.status(201).send(data);
    } catch (err) {
        if (err.status === 409) {
            handleHttpError(res, err.message, 409);
        } else {
            handleHttpError(res, "ERROR_CREATE_USER", 500);
        }
    }
};

const verifyEmailCtrl = async (req, res) => {
    try {
        const { verificationCode } = matchedData(req);
        const user = req.user;

        const result = await verifyUserCode(user, verificationCode);
        res.status(200).send(result);
    } catch (err) {
        handleHttpError(res, err.message, err.status || 400);
    }
};

const loginCtrl = async (req, res) => {
    try {
        const { email, password } = matchedData(req);
        const { user, accessToken, refreshToken } = await loginUser(email, password);

        // Establecemos el Refresh Token en una cookie HttpOnly
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({ user, accessToken });
    } catch (err) {
        handleHttpError(res, err.message, err.status || 400);
    }
};

const forgotPasswordCtrl = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await forgotPassword(email);
        res.status(200).json(response);
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const resetPasswordCtrl = async (req, res) => {
    try {
        const { token, password } = req.body;
        const response = await resetPassword(token, password);
        res.status(200).json(response);
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const refreshTokenCtrl = (req, res) => {
    try {
        const { accessToken } = refreshTokenService(req.user);
        res.status(200).json({ accessToken });
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const logoutCtrl = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) throw { status: 403, message: "INVALID_USER" };

        // Eliminamos el Refresh Token de Redis
        const result = await logoutUser(userId);

        // Limpiamos la cookie del Refresh Token
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.status(200).json(result);
    } catch (error) {
        handleHttpError(res, error.message, error.status || 500);
    }
};

module.exports = { registerCtrl, verifyEmailCtrl, loginCtrl, forgotPasswordCtrl, resetPasswordCtrl, refreshTokenCtrl, logoutCtrl };
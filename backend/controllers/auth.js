const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");
const { registerUser, verifyUserCode, loginUser, forgotPassword, resetPassword } = require("../services/auth");
const { clearAuthCookie } = require("../utils/handleJwt");

const registerCtrl = async (req, res) => {
    try {
        const cleanData = matchedData(req); // Extraemos los datos validados
        const data = await registerUser(cleanData); // Llama al servicio
    
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
        const result = await loginUser(email, password);
        res.status(200).json(result);
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

const logoutCtrl = (req, res) => {
    try {
        clearAuthCookie(res);
        res.status(200).json({ message: 'Sesión cerrada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión' });
    }
};



module.exports = { registerCtrl, verifyEmailCtrl, loginCtrl, forgotPasswordCtrl, resetPasswordCtrl, logoutCtrl };
const { check } = require('express-validator');
const { validateResults } = require('../utils/handleValidator');

const validatorRegister = [
    check("nickname")
        .exists().withMessage("El nickname es obligatorio")
        .notEmpty().withMessage("El nickname no puede estar vacío")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Solo se permiten letras, números y guiones bajos")
        .isLength({ min: 3, max: 20 }).withMessage("El nickname debe tener entre 3 y 20 caracteres"),

    check("email")
        .exists().withMessage("El email es obligatorio")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("El email no es válido"),
    
    check("password")
        .exists().withMessage("La contraseña es obligatoria")
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 8, max: 16 }).withMessage("La contraseña debe tener entre 8 y 16 caracteres"),

    check("role")
        .optional()
        .isIn(["admin", "user"]).withMessage("El rol debe ser 'admin' o 'user'"),

    (req, res, next) => validateResults(req, res, next)
];

const validatorCode = [
    check("verificationCode")
        .exists().withMessage("El código es obligatorio")
        .notEmpty().withMessage("El código no puede estar vacío")
        .isLength({ min: 6, max: 6 }).withMessage("El código debe tener exactamente 6 dígitos")
        .isNumeric().withMessage("El código debe ser numérico"),

    (req, res, next) => validateResults(req, res, next)
];

const validatorLogin = [
    check("email")
        .exists().withMessage("El email es obligatorio")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("Debe ser un email válido"),

    check("password")
        .exists().withMessage("La contraseña es obligatoria")
        .notEmpty().withMessage("La contraseña no puede estar vacía"),

    (req, res, next) => validateResults(req, res, next)
];

const validatorForgotPassword = [
    check("email").exists().notEmpty().isEmail(),
    (req, res, next) => validateResults(req, res, next)
];

const validatorResetPassword = [
    check("token").exists().notEmpty(),
    check("password").exists().notEmpty().
    isLength({ min: 8, max: 16 }).withMessage("La contraseña debe tener entre 8 y 16 caracteres"),
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorRegister, validatorCode, validatorLogin, validatorForgotPassword, validatorResetPassword };

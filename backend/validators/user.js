const { body } = require('express-validator');
const { validateResults } = require('../utils/handleValidator');

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const validatorCompleteRegister = [
  body('name')
    .exists()
    .withMessage('El nombre es obligatorio')
    .notEmpty()
    .withMessage('El nickname no puede estar vacío')
    .isLength({ min: 3, max: 15 })
    .withMessage('El nombre debe tener entre 3 y 15 caracteres'),

  body('lastName')
    .exists()
    .withMessage('Los apellidos son obligatorios')
    .notEmpty()
    .withMessage('Los apellidos no pueden estar vacíos')
    .isLength({ min: 3, max: 20 })
    .withMessage('Los apellidos deben tener entre 3 y 20 caracteres'),

  body('birthDate')
    .exists()
    .withMessage('La fecha de nacimiento es obligatoria.')
    .notEmpty()
    .withMessage('La fecha de nacimiento no puede estar vacía.')
    .isDate()
    .withMessage('La fecha de nacimiento debe estar en formato YYYY-MM-DD.'),
  (req, res, next) => validateResults(req, res, next),
];

const validatorProfilePicture = [
  body('logo').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('No hay archivo subido');
    }
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      throw new Error('El archivo debe ser una imagen (JPEG, JPG, PNG)');
    }
    return true;
  }),
  (req, res, next) => validateResults(req, res, next),
];

const validatorUpdateProfile = [
  body('nickname')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('El nickname debe tener entre 3 y 20 caracteres.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Solo se permiten letras, números y guiones bajos'),

  body('name')
    .optional()
    .isLength({ min: 3, max: 15 })
    .withMessage('El nombre debe tener entre 3 y 15 caracteres'),

  body('lastName')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Los apellidos deben tener entre 3 y 20 caracteres'),

  (req, res, next) => validateResults(req, res, next),
];

const validatorChangePassword = [
  body('currentPassword')
    .exists()
    .withMessage('La contraseña es obligatoria')
    .notEmpty()
    .withMessage('La contraseña no puede estar vacía')
    .isLength({ min: 8, max: 16 })
    .withMessage('La contraseña debe tener entre 8 y 16 caracteres'),

  body('newPassword')
    .exists()
    .withMessage('La contraseña es obligatoria')
    .notEmpty()
    .withMessage('La contraseña no puede estar vacía')
    .isLength({ min: 8, max: 16 })
    .withMessage('La contraseña debe tener entre 8 y 16 caracteres'),

  (req, res, next) => validateResults(req, res, next),
];

module.exports = {
  validatorCompleteRegister,
  validatorProfilePicture,
  validatorUpdateProfile,
  validatorChangePassword,
};

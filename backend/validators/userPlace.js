const { check } = require('express-validator');
const { validateResults } = require('../utils/handleValidator');

const validatorCreateUserPlace = [
    check('placeId')
        .exists()
        .notEmpty()
        .isMongoId()
        .withMessage('El ID del lugar es obligatorio y debe ser un ID de MongoDB válido'),
    check('status')
        .exists()
        .notEmpty()
        .isIn(['visited', 'favorite', 'pending'])
        .withMessage('El estado es obligatorio y debe ser uno de los siguientes: visited, favorite, pending'),
    check('visitedAt')
        .optional()
        .isDate()
        .withMessage('visitedAt debe ser una fecha válida en formato YYYY-MM-DD'),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorCreateUserPlace };
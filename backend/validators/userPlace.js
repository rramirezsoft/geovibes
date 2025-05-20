const { check } = require('express-validator');
const { validateResults } = require('../utils/handleValidator');
const UserPlace = require('../models/nosql/userPlace');

const validStatuses = UserPlace.schema.path('status').enumValues.map((status) => status.toString());

const validatorCreateUserPlace = [
  check('placeId')
    .exists()
    .notEmpty()
    .isMongoId()
    .withMessage('El ID del lugar es obligatorio y debe ser un ID de MongoDB válido'),
  check('status')
    .exists()
    .notEmpty()
    .isIn(validStatuses)
    .withMessage(
      'El estado es obligatorio y debe ser uno de los siguientes: visited, favorite, pending'
    ),
  check('visitedAt')
    .optional()
    .isDate()
    .withMessage('visitedAt debe ser una fecha válida en formato YYYY-MM-DD'),
  (req, res, next) => validateResults(req, res, next),
];

const validatorUserPlaceFilters = [
  check('category').optional().isString().withMessage('La categoría debe ser una cadena'),
  check('status')
    .optional()
    .isString()
    .isIn(validStatuses)
    .withMessage('El estado debe ser uno de los siguientes: visited, favorite, pending'),
];

const validatorPlaceId = [
  check('id')
    .exists()
    .withMessage('El ID del userPlace es obligatorio')
    .notEmpty()
    .withMessage('El ID del userPlace no puede estar vacío')
    .isMongoId()
    .withMessage('El ID del userPlace no es válido'),

  (req, res, next) => validateResults(req, res, next),
];

module.exports = { validatorCreateUserPlace, validatorUserPlaceFilters, validatorPlaceId };

const { check } = require("express-validator");
const { validateResults } = require("../utils/handleValidator");

const validatorCreatePlace = [
    check("placeName")
        .exists().withMessage("El nombre del lugar es obligatorio")
        .notEmpty().withMessage("El nombre del lugar no puede estar vacío")
        .isString().withMessage("El nombre del lugar debe ser un texto"),

    (req, res, next) => validateResults(req, res, next)
];

const validatorGetPlaceById = [
    check("id")
        .exists().withMessage("El id del lugar es obligatorio")
        .notEmpty().withMessage("El id del lugar no puede estar vacío")
        .isMongoId().withMessage("El id del lugar no es válido"),

    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorCreatePlace, validatorGetPlaceById };

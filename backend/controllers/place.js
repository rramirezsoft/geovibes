const { matchedData } = require("express-validator");
const { findOrCreatePlace, getPlaces, getPlaceById } = require("../services/place");
const { handleHttpError } = require("../utils/handleError");

const findOrCreatePlaceCtrl = async (req, res) => {
    try {
        const { placeName } = matchedData(req);

        const result = await findOrCreatePlace(placeName);

        return res.status(result.status).json({
            message: result.message,
            place: result.place,
        });
    } catch (error) {
        handleHttpError(res, error.message, error.status || 500);
    }
};

const getPlacesCtrl = async (req, res) => {
    try {
        const places = await getPlaces();
        res.status(200).json(places);
    } catch (error) {
        handleHttpError(res, error.message, error.status || 500);
    }
};

const getPlaceByIdCtrl = async (req, res) => {
    try {
        const { id } = matchedData(req);
        const place = await getPlaceById(id);
        res.status(200).json(place);
    } catch (error) {
        handleHttpError(res, error.message, error.status || 500);
    }
};

module.exports = { findOrCreatePlaceCtrl, getPlacesCtrl, getPlaceByIdCtrl };

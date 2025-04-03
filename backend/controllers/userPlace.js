const { matchedData } = require("express-validator");
const { createUserPlace, updateUserPlace, getUserPlaces } = require("../services/userPlace");
const { handleHttpError } = require("../utils/handleError");

const createUserPlaceCtrl = async (req, res) => {
    try {
        const { placeId, status, visitedAt } = matchedData(req);
        const userId = req.user._id;

        const result = await createUserPlace(userId, placeId, status, visitedAt);
        res.status(201).json(result);
    } catch (error) {
        handleHttpError(res, error.message, 400);
    }
};

const updateUserPlaceCtrl = async (req, res) => {
    try {
        const { placeId, status, visitedAt } = matchedData(req);
        const userId = req.user._id;

        const result = await updateUserPlace(userId, placeId, status, visitedAt);
        res.status(200).json(result);
    } catch (error) {
        handleHttpError(res, error.message, error.status || 400);
    }
};

const getUserPlacesCtrl = async (req, res) => {
    try {
        const userId = req.user._id;
        const { category } = req.query;

        const result = await getUserPlaces(userId, category);
        res.status(200).json(result);
    } catch (error) {
        handleHttpError(res, error.message, 400);
    }
};

module.exports = { createUserPlaceCtrl, updateUserPlaceCtrl, getUserPlacesCtrl };

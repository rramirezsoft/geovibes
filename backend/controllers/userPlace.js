const { matchedData } = require("express-validator");
const { createUserPlace, updateUserPlace, getUserPlaces, deleteUserPlace, countUserPlaces } = require("../services/userPlace");
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
        const { category, status } = req.query;

        const result = await getUserPlaces(userId, category, status);
        res.status(200).json(result);
    } catch (error) {
        handleHttpError(res, error.message, 400);
    }
};

const deleteUserPlaceCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { soft } = req.query;
        const userId = req.user._id;

        const result = await deleteUserPlace(userId, id, soft !== "false"); 
        res.status(200).json(result);
    } catch (error) {
        handleHttpError(res, error.message, error.status || 400);
    }
};

const countUserPlacesCtrl = async (req, res) => {
    try {
        const { category, status } = req.query;
        const userId = req.user._id;

        const result = await countUserPlaces(userId, category, status);
        res.status(200).json(result);
    } catch (error) {
        handleHttpError(res, error.message, error.status || 400);
    }
};

module.exports = { createUserPlaceCtrl, updateUserPlaceCtrl, getUserPlacesCtrl, deleteUserPlaceCtrl, countUserPlacesCtrl };

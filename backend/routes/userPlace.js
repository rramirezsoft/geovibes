const express = require("express");
const { createUserPlaceCtrl, updateUserPlaceCtrl, getUserPlacesCtrl, deleteUserPlaceCtrl, countUserPlacesCtrl } = require("../controllers/userPlace");
const { validatorCreateUserPlace, validatorUserPlaceFilters } = require("../validators/userPlace");
const { authMiddleware } = require("../middleware/session");

const router = express.Router();

router.post('/create', authMiddleware, validatorCreateUserPlace, createUserPlaceCtrl);
router.patch('/update', authMiddleware, validatorCreateUserPlace, updateUserPlaceCtrl);
router.get('/', authMiddleware, validatorUserPlaceFilters, getUserPlacesCtrl);
router.delete('/:id', authMiddleware, deleteUserPlaceCtrl);
router.get('/count', authMiddleware, validatorUserPlaceFilters, countUserPlacesCtrl);

module.exports = router;

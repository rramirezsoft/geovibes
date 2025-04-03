const express = require("express");
const { createUserPlaceCtrl, updateUserPlaceCtrl, getUserPlacesCtrl } = require("../controllers/userPlace");
const { validatorCreateUserPlace } = require("../validators/userPlace");
const { authMiddleware } = require("../middleware/session");

const router = express.Router();

router.post('/create', authMiddleware, validatorCreateUserPlace, createUserPlaceCtrl);
router.patch('/update', authMiddleware, validatorCreateUserPlace, updateUserPlaceCtrl);
router.get('/', authMiddleware, getUserPlacesCtrl);

module.exports = router;

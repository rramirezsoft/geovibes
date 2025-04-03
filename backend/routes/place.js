const express = require("express");
const { findOrCreatePlaceCtrl, getPlacesCtrl, getPlaceByIdCtrl } = require("../controllers/place");
const { validatorCreatePlace, validatorGetPlaceById } = require("../validators/place");
const { authMiddleware } = require("../middleware/session");

const router = express.Router();

router.post("/find-or-create", authMiddleware, validatorCreatePlace, findOrCreatePlaceCtrl);
router.get("/", authMiddleware, getPlacesCtrl);
router.get("/:id", authMiddleware, validatorGetPlaceById, getPlaceByIdCtrl);

module.exports = router;

const express = require("express");
const { findOrCreatePlaceCtrl, getPlacesCtrl, getPlaceByIdCtrl } = require("../controllers/place");
const { validatorCreatePlace, validatorPlaceId } = require("../validators/place");
const { authMiddleware } = require("../middleware/session");

const router = express.Router();

router.post("/find-or-create", authMiddleware, validatorCreatePlace, findOrCreatePlaceCtrl);
router.get("/", authMiddleware, getPlacesCtrl);
router.get("/:id", authMiddleware, validatorPlaceId, getPlaceByIdCtrl);

module.exports = router;

const express = require("express");
const { 
    createUserPlaceCtrl, 
    updateUserPlaceCtrl, 
    getUserPlacesCtrl,
    getUserPlaceByIdCtrl, 
    deleteUserPlaceCtrl, 
    countUserPlacesCtrl 
} = require("../controllers/userPlace");
const { validatorCreateUserPlace, validatorUserPlaceFilters, validatorPlaceId } = require("../validators/userPlace");
const { authMiddleware } = require("../middleware/session");

const router = express.Router();

router.post('/create', authMiddleware, validatorCreateUserPlace, createUserPlaceCtrl);
router.patch('/update', authMiddleware, validatorCreateUserPlace, updateUserPlaceCtrl);
router.get('/count', authMiddleware, validatorUserPlaceFilters, countUserPlacesCtrl); 
router.get('/', authMiddleware, validatorUserPlaceFilters, getUserPlacesCtrl);
router.get('/:id', authMiddleware, validatorPlaceId, getUserPlaceByIdCtrl);
router.delete('/:id', authMiddleware, validatorPlaceId, deleteUserPlaceCtrl);


module.exports = router;

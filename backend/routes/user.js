const express = require("express");
const { 
    completeRegistrationCtrl, 
    updateProfileCtrl, 
    getUserProfileCtrl, 
    changePasswordCtrl,
    deleteUserCtrl,
    reactivateUserCtrl
    } = require("../controllers/user");
const { validatorCompleteRegistration, validatorUpdateProfile, validatorChangePassword } = require("../validators/user");
const authMiddleware = require("../middleware/session");
const { uploadMiddlewareMemory } = require("../middleware/storage");

const router = express.Router();

router.put("/complete-register", authMiddleware, uploadMiddlewareMemory.single("profilePicture"), validatorCompleteRegistration, completeRegistrationCtrl);
router.patch("/update-profile", authMiddleware, uploadMiddlewareMemory.single("profilePicture"), validatorUpdateProfile, updateProfileCtrl);
router.get("/:nickname", authMiddleware, getUserProfileCtrl);
router.put("/change-password", authMiddleware, validatorChangePassword, changePasswordCtrl);
router.delete("/:id", authMiddleware, deleteUserCtrl);
router.post('/reactivate/:id', authMiddleware, reactivateUserCtrl);

module.exports = router;

const express = require("express");
const { 
    registerCtrl, 
    verifyEmailCtrl, 
    loginCtrl, 
    forgotPasswordCtrl, 
    resetPasswordCtrl,
    refreshTokenCtrl, 
    logoutCtrl 
} = require("../controllers/auth");
const { 
    validatorRegister, 
    validatorCode, 
    validatorLogin, 
    validatorForgotPassword, 
    validatorResetPassword 
} = require("../validators/auth");
const { authMiddleware, refreshAuthMiddleware} = require("../middleware/session");

const router = express.Router();

router.post("/register", validatorRegister, registerCtrl);
router.put("/validate", authMiddleware, validatorCode, verifyEmailCtrl);
router.post("/login", validatorLogin, loginCtrl);
router.post('/forgot-password', validatorForgotPassword, forgotPasswordCtrl);
router.post('/reset-password', validatorResetPassword, resetPasswordCtrl);
router.post('/refresh', refreshAuthMiddleware, refreshTokenCtrl);
router.post('/logout', authMiddleware, logoutCtrl);

module.exports = router;
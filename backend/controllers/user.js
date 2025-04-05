const { matchedData } = require("express-validator");
const { 
    completeRegister,
    uploadProfilePicture,
    updateUserProfile,
    getUserProfile,
    changePassword,
    deleteUser,
    reactivateUser
    } = require("../services/user");
const { handleHttpError } = require("../utils/handleError");

const completeRegisterCtrl = async (req, res) => {
    try {
        const cleanData = matchedData(req); 
        const userId = req.user._id; 

        const updatedUser = await completeRegister(userId, cleanData);

        updatedUser.set("password", undefined, { strict: false });

        res.status(200).json({
            message: "PROFILE_COMPLETED_SUCCESSFULLY",
            user: updatedUser
        });
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const uploadProfilePictureCtrl = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "NO_FILE_UPLOATED" });
        }
        
        const userId = req.user._id;
        const fileBuffer = req.file.buffer;
        const fileName = `${userId}_profilePicture.${req.file.mimetype.split('/')[1]}`;
        
        const updatedUser = await uploadProfilePicture(userId, fileBuffer, fileName);
        updatedUser.set("password", undefined, { strict: false });
        
        res.status(200).json({
            message: "PROFILE_PICTURE_UPLOADED_SUCCESSFULLY",
            user: updatedUser
        });
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const updateProfileCtrl = async (req, res) => {
    try {
        const cleanData = matchedData(req);
        const userId = req.user._id; // ID del usuario autenticado

        const updatedUser = await updateUserProfile(userId, cleanData);
        updatedUser.set("password", undefined, { strict: false });

        res.status(200).json({
            message: "PROFILE_FIEDLS_UPDATED_SUCCESSFULLY",
            user: updatedUser,
        });
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const getUserProfileCtrl = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await getUserProfile(userId);

        res.status(200).json({ user });
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const changePasswordCtrl = async (req, res) => {
    try {
        const { currentPassword, newPassword } = matchedData(req);
        const userId = req.user._id; 

        const result = await changePassword(userId, currentPassword, newPassword);

        res.status(200).json(result);
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const deleteUserCtrl = async (req, res) => {
    try {
        const userId = req.user._id;
        const softDelete = req.query.soft !== "false"; 

        const message = await deleteUser(userId, softDelete);

        res.status(200).json({ message });
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const reactivateUserCtrl = async (req, res) => {
    try {
        const { email, password } = req.body;
        const updatedUser = await reactivateUser(email, password);

        res.status(200).json({
            message: "USER_REACTIVATED_SUCCESSFULLY",
            user: updatedUser
        });
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

module.exports = { 
    completeRegisterCtrl,
    uploadProfilePictureCtrl, 
    updateProfileCtrl, 
    getUserProfileCtrl, 
    changePasswordCtrl, 
    deleteUserCtrl,
    reactivateUserCtrl
};

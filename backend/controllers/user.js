const { matchedData } = require("express-validator");
const { 
    completeUserProfile,
    updateUserProfile,
    getUserProfile,
    changePassword,
    deleteUser,
    reactivateUser
    } = require("../services/user");
const { handleHttpError } = require("../utils/handleError");

const completeRegistrationCtrl = async (req, res) => {
    try {
        const cleanData = matchedData(req); 
        const userId = req.user._id; // Usamos el ID del usuario autenticado desde el middleware

        // Si se ha subido una imagen, la añadimos a cleanData
        if (req.file) {
            cleanData.profilePicture = req.file;
        }

        // Llamamos al servicio para completar el perfil
        const updatedUser = await completeUserProfile(userId, cleanData);

        updatedUser.set("password", undefined, { strict: false });

        res.status(200).json({
            message: "PROFILE_COMPLETED_SUCCESSFULLY",
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

        // Si se sube una imagen, la añadimos a cleanData
        if (req.file) {
            cleanData.profilePicture = req.file;
        }

        const updatedUser = await updateUserProfile(userId, cleanData);
        updatedUser.set("password", undefined, { strict: false });

        res.status(200).json({
            message: "PROFILE_UPDATED_SUCCESSFULLY",
            user: updatedUser,
        });
    } catch (err) {
        handleHttpError(res, err.message, err.status || 500);
    }
};

const getUserProfileCtrl = async (req, res) => {
    try {
        const { nickname } = req.params;
        const userProfile = await getUserProfile(nickname);

        res.status(200).json({
            user: userProfile
        });
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
        const { id } = req.params; 
        const isSoft = req.query.soft === 'false' ? false : true;  // Si soft=false, hacer hard delete

        const deletedUser = await deleteUser(id, isSoft);

        if (req.query.soft === 'false') {
            return res.status(200).json({message: "USER_HARD_DELETED_SUCCESSFULLY"});
        }
        else if(req.query.soft === 'true') {
            return res.status(200).json({
                message: "USER_SOFT_DELETED_SUCCESSFULLY",
                user: deletedUser
            });
        }
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
    completeRegistrationCtrl, 
    updateProfileCtrl, 
    getUserProfileCtrl, 
    changePasswordCtrl, 
    deleteUserCtrl,
    reactivateUserCtrl
};

const User = require('../models/nosql/user');
const { uploadToPinata } = require('../utils/handleUploadIPFS'); 
const { compare, encrypt } = require('../utils/handlePassword');


/**
 * Completa o actualiza el perfil del usuario.
 * @param {Object} userId - ID del usuario autenticado
 * @param {Object} profileData - Datos del perfil (nombre, apellidos, fecha de nacimiento, foto de perfil)
 * @returns {Object} - El usuario actualizado
 */
const completeUserProfile = async (userId, profileData) => {
    try {
        const { name, lastName, birthDate, profilePicture } = profileData;

        let ipfsLink = undefined;
        
        // Si hay foto de perfil, sube a Pinata
        if (profilePicture) {
            const pinataResponse = await uploadToPinata(profilePicture.buffer, profilePicture.originalname); 
            const ipfsFile = pinataResponse.IpfsHash;
            ipfsLink = `${process.env.PINATA_GATEWAY_URL}/${ipfsFile}`; 
        }

        // Actualiza el usuario con los nuevos datos
        const updatedUser = await User.findByIdAndUpdate(userId, {
            name,
            lastName,
            birthDate,
            profilePicture: ipfsLink || undefined // Si no se proporciona foto, no actualizamos el campo
        }, { new: true });

        if (!updatedUser) {
            throw { status: 404, message: "USER_NOT_FOUND" };
        }

        return updatedUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Actualiza el perfil del usuario (nickname y/o imagen de perfil)
 * @param {ObjectId} userId - ID del usuario autenticado
 * @param {Object} profileData - Datos a actualizar (nickname, profilePicture)
 * @returns {Object} - El usuario actualizado
 */
const updateUserProfile = async (userId, profileData) => {
    try {
        const { nickname, profilePicture } = profileData;
        let updateFields = {};

        // Si el usuario quiere cambiar el nickname, verificamos que no esté en uso
        if (nickname) {
            const nicknameExists = await User.findOne({ nickname });
            if (nicknameExists) {
                throw { status: 400, message: "NICKNAME_ALREADY_EXISTS" };
            }
            updateFields.nickname = nickname;
        }

        // Si hay imagen de perfil, subimos a Pinata
        if (profilePicture) {
            const pinataResponse = await uploadToPinata(profilePicture.buffer, profilePicture.originalname);
            const ipfsFile = pinataResponse.IpfsHash;
            updateFields.profilePicture = `${process.env.PINATA_GATEWAY_URL}/${ipfsFile}`;
        }

        // Actualiza el usuario con los nuevos datos
        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!updatedUser) {
            throw { status: 404, message: "USER_NOT_FOUND" };
        }

        return updatedUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtiene el perfil de un usuario por su nickname
 * @param {String} nickname - Nickname del usuario
 * @returns {Object} - Perfil del usuario
 */
const getUserProfile = async (nickname) => {
    try {
        const user = await User.findOne({ nickname }).select("-__v");

        if (!user) {throw { status: 404, message: "USER_NOT_FOUND" };}

        return user;

    } catch (error) {
        throw error;
    }
};

/**
 * Cambia la contraseña del usuario.
 * @param {String} userId - ID del usuario
 * @param {String} currentPassword - Contraseña actual
 * @param {String} newPassword - Nueva contraseña
 * @returns {Object} - Mensaje de éxito
 */
const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw { status: 404, message: "USER_NOT_FOUND" };
        }

        // Comparamos la contraseña actual
        const isMatch = await compare(currentPassword, user.password);
        if (!isMatch) {
            throw { status: 400, message: "INCORRECT_CURRENT_PASSWORD" };
        }

        // Encripta la nueva contraseña
        const hashedPassword = await encrypt(newPassword);

        user.password = hashedPassword;
        await user.save(); 

        return { message: "PASSWORD CHANGED SUCCESFULLY" };
    } catch (error) {
        throw error;
    }
};

/**
 *  Delete de un usuario
 * @param {String} userId - ID del usuario a eliminar
 * @param {Boolean} isSoft - Si es true, realiza un soft delete, sino, hard delete
 * @returns {Object} - Usuario eliminado (con soft delete, tiene el campo `deletedAt`)
 */
const deleteUser = async (userId, isSoft = true) => {
    try {
        const user = await User.findById(userId);

        if (!user) { throw { status: 404, message: "USER_NOT_FOUND" }; }

        if (isSoft) { await user.delete(); } 
        
        else { await User.deleteOne({ _id: userId }); }

        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * Reactiva una cuenta de usuario desactivada.
 * @param {String} email - El email del usuario
 * @param {String} password - La contraseña del usuario
 * @returns {Object} - El usuario reactivado
 */
const reactivateUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });

        if (!user) { throw { status: 404, message: "USER_NOT_FOUND" }; }

        if (!user.deleted) { throw { status: 400, message: "USER_ALREADY_ACTIVE" }; }

        // Verificar la contraseña
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) { throw { status: 401, message: "INVALID_CREDENTIALS" }; }

        // Elimina los campos de soft delete
        user.deleted = undefined;
        user.deletedAt = undefined;

        await user.save();

        return user;
    } catch (error) {
        throw error;
    }
};
module.exports = { 
    completeUserProfile, 
    updateUserProfile, 
    getUserProfile, 
    changePassword, 
    deleteUser, 
    reactivateUser 
};

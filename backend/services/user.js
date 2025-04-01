const User = require('../models/nosql/user');
const { uploadToPinata, deleteFileFromPinata } = require('../utils/handleUploadIPFS'); 
const { compare, encrypt } = require('../utils/handlePassword');

/**
 * Completa el registro del usuario.
 * @param {Object} userId - ID del usuario autenticado
 * @param {Object} profileData - Datos del perfil (nombre, apellidos, fecha de nacimiento)
 * @returns {Object} - El usuario actualizado
 */
const completeRegister = async (userId, profileData) => {
    try {
        const { name, lastName, birthDate } = profileData;

        // Actualiza el usuario con los nuevos datos
        const updatedUser = await User.findByIdAndUpdate(userId, {
            name,
            lastName,
            birthDate
        }, { new: true });

        if (!updatedUser) { throw { status: 404, message: "USER_NOT_FOUND" }; }
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Sube un logo de usuario a Pinata (IPFS) y guarda la URL en la base de datos.
 * @param {string} userId - ID del usuario autenticado.
 * @param {Buffer} fileBuffer - Datos del archivo de imagen en formato buffer.
 * @param {string} fileName - Nombre del archivo a subir.
 * @returns {Object} - Usuario actualizado con la URL del logo.
 */
const uploadProfilePicture = async (userId, fileBuffer, fileName) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw { status: 404, message: "USER_NOT_FOUND" };

        if (user.profilePicture !== null) {
            const cid = user.profilePicture.split("/").pop();
            await deleteFileFromPinata(cid);
        }
        
        const response = await uploadToPinata(fileBuffer, fileName);
        const imageUrl = `${process.env.PINATA_GATEWAY_URL}/${response.IpfsHash}`;
        
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: imageUrl }, { new: true });
        
        if (!updatedUser) {
            throw { status: 404, message: "USER_NOT_FOUND" };
        }

        return updatedUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Actualiza los campos del perfil del usuario (nickname, name, y/o lastName).
 * @param {ObjectId} userId - ID del usuario autenticado
 * @param {Object} profileData - Datos a actualizar (nickname, profilePicture)
 * @returns {Object} - El usuario actualizado
 */
const updateUserProfile = async (userId, profileData) => {
    try {
        const { nickname, name, lastName } = profileData;
        let updateFields = {};

        // Si el usuario quiere cambiar el nickname, verificamos que no esté en uso
        if (nickname) {
            const nicknameExists = await User.findOne({ nickname });
            if (nicknameExists) {
                throw { status: 400, message: "NICKNAME_ALREADY_EXISTS" };
            }
            updateFields.nickname = nickname;
        }
        // Si el usuario quiere cambiar el nombre o apellidos, los actualizamos
        if (name) { updateFields.name = name; }
        if (lastName) { updateFields.lastName = lastName; }

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
 * Obtiene los datos del usuario autenticado.
 * @param {string} userId - ID del usuario autenticado.
 * @returns {Object} - Datos del usuario sin la contraseña.
 */
const getUserProfile = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password -__v'); 
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
 * @returns {String} - Mensaje de éxito
 */
const deleteUser = async (userId, isSoft = true) => {
    try {
        const user = await User.findById(userId);
        if (!user) { throw { status: 404, message: "USER_NOT_FOUND" }; }

        if (isSoft) { 
            await user.delete();
            return "USER_SOFT_DELETED_SUCCESSFULLY";
         } 
        else { 
            if (user.profilePicture !== null) {
                const cid = user.profilePicture.split("/").pop(); 
                await deleteFileFromPinata(cid);
            }
            await User.deleteOne({ _id: userId }); 
            return "USER_HARD_DELETED_SUCCESSFULLY";
        }
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
    completeRegister,
    uploadProfilePicture, 
    updateUserProfile, 
    getUserProfile, 
    changePassword, 
    deleteUser, 
    reactivateUser 
};

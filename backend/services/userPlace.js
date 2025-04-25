const UserPlace = require("../models/nosql/userPlace");
const Place = require("../models/nosql/place");
const { applyUserPlaceFilters } = require("../utils/handleUserPlaceFilters");

/**
 * Registra un lugar para un usuario con un estado específico.
 * @param {ObjectId} userId - ID del usuario.
 * @param {ObjectId} placeId - ID del lugar.
 * @param {string} status - Estado del lugar (visited, favorite, pending).
 * @param {Date} visitedAt - Fecha de visita (opcional).
 * @returns {Object} - Registro creado o actualizado.
 */
const createUserPlace = async (userId, placeId, status, visitedAt = null) => {
    try {
        let userPlace = await UserPlace.findOne({ user: userId, place: placeId });
        if (userPlace) { throw { status: 409, message: "USER_PLACE_ALREADY_EXISTS" }; }

        // Si no existe, lo creamos
        userPlace = await UserPlace.create({ user: userId, place: placeId, status, visitedAt });

         // Si el estado es 'visited', añadimos el usuario al campo 'visitedBy' del lugar
         if (status === 'visited') {
            let place = await Place.findById(placeId);
            if (!place) throw { status: 404, message: "PLACE_NOT_FOUND" };

            // Verificamos si el usuario ya ha sido agregado, y si no, lo agregamos
            if (!place.visitedBy.includes(userId)) {
                place.visitedBy.push(userId);
                await place.save();
            }
        }
        return { message: "USER_PLACE_CREATED", userPlace };
    } catch (error) {
        console.error("❌ Error en registerUserPlace:", error);
        throw error;
    }
};

/**
 * Actualiza el estado de un UserPlace.
 * @param {ObjectId} userId - ID del usuario.
 * @param {ObjectId} placeId - ID del lugar.
 * @param {string} status - Nuevo estado (visited, favorite, pending).
 * @param {Date} visitedAt - Fecha de visita (opcional).
 * @returns {Object} - Registro actualizado.
 */
const updateUserPlace = async (userId, placeId, status, visitedAt = null) => {
    try {
        let userPlace = await UserPlace.findOne({ user: userId, place: placeId });
        if (!userPlace) throw { status: 404, message: "USER_PLACE_NOT_FOUND" };

        let place = await Place.findById(placeId);
        if (!place) throw { status: 404, message: "PLACE_NOT_FOUND" };

        // Actualizamos los campos necesarios
        userPlace.status = status;
        if (status === "visited") {
            userPlace.visitedAt = visitedAt || new Date();

            if (!place.visitedBy.includes(userId)) {
                place.visitedBy.push(userId);
                await place.save();
            }
        }
        else if (status === "pending") {
            userPlace.visitedAt = null;

            if (place.visitedBy.includes(userId)) {
                place.visitedBy = place.visitedBy.filter(id => id.toString() !== userId.toString());
                await place.save();
            }
        }
        await userPlace.save();
        return { message: "USER_PLACE_UPDATED", userPlace };
    } catch (error) {
        console.error("❌ Error en updateUserPlace:", error);
        throw error;
    }
};

/**
 * Obtiene los lugares registrados de un usuario, con filtros de categoria y/o estado.
 * @param {ObjectId} userId - ID del usuario
 * @param {String} category - Categoría del lugar (opcional)
 * @param {String} status - Estado del lugar (opcional)
 * @returns {Array} - Lista de lugares del usuario
 */
const getUserPlaces = async (userId, category = null, status = null) => {
    try {
        let query = { user: userId };

        query = await applyUserPlaceFilters(query, category, status); // Aplicamos los filtros de categoría y estado

        const userPlaces = await UserPlace.find(query)
        .populate("place", "name location address country city category");

        return { message: "USER_PLACES_FOUND", userPlaces };
    } catch (error) {
        console.error("❌ Error en getUserPlaces:", error);
        throw error;
    }
};

/**
 * Obtiene un lugar específico registrado por un usuario.
 * @param {ObjectId} userId - ID del usuario.
 * @param {ObjectId} placeId - ID del lugar.
 * @returns {Object} - Detalle del lugar registrado del usuario.
 */
const getUserPlaceById = async (userId, userPlaceId) => {
    try {
        const userPlace = await UserPlace.findOne({ _id: userPlaceId, user: userId })
            .populate("place", "name location address country city category");

        if (!userPlace) throw { status: 404, message: "USER_PLACE_NOT_FOUND" };

        return { message: "USER_PLACE_FOUND", userPlace };
    } catch (error) {
        console.error("❌ Error en getUserPlaceById:", error);
        throw error;
    }
}

/**
 * Elimina un UserPlace (soft delete o hard delete).
 * @param {ObjectId} userId - ID del usuario.
 * @param {ObjectId} userPlaceId - ID del UserPlace.
 * @param {boolean} soft - Indica si es un soft delete.
 * @returns {Object} - Mensaje de éxito.
 */
const deleteUserPlace = async (userId, userPlaceId, soft = true) => {
    try {
        const userPlace = await UserPlace.findOne({ _id: userPlaceId, user: userId });
        if (!userPlace) throw { status: 404, message: "USER_PLACE_NOT_FOUND" };

        if (soft) {
            await userPlace.delete(); 
            return { message: "USER_PLACE_SOFT_DELETED" };
        } else {
            await UserPlace.deleteOne({ _id: userPlaceId });
            return { message: "USER_PLACE_HARD_DELETED" };
        }
    } catch (error) {
        console.error("❌ Error en deleteUserPlace:", error);
        throw error;
    }
};

/**
 * Cuenta el número de lugares registrados de un usuario, filtrando por categoría y/o estado.
 * @param {String} userId - ID del usuario.
 * @param {String} category - Categoría del lugar (opcional).
 * @param {String} status - Estado del lugar (opcional).
 * @returns {Object} - Número de lugares registrados del usuario con los filtros aplicados.
 */
const countUserPlaces = async (userId, category = null, status = null) => {
    try {
        let query = { user: userId };

        // Aplicamos los filtros de categoría y estado
        query = await applyUserPlaceFilters(query, category, status);

        const count = await UserPlace.countDocuments(query);

        return { message: "USER_PLACES_COUNT", count };
    } catch (error) {
        console.error("❌ Error en countUserPlaces:", error);
        throw error;
    }
};

module.exports = { createUserPlace, updateUserPlace, getUserPlaces, getUserPlaceById, deleteUserPlace, countUserPlaces };

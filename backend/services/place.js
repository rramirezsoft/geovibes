const axios = require('axios');
const Place = require('../models/nosql/place');

/**
 * Busca un lugar en la BD o lo registra si no existe.
 * @param {string} placeName - Nombre del lugar a buscar.
 * @returns {Object} - Lugar encontrado o creado.
 * @throws {Error} - Si ocurre un error al buscar o crear el lugar.
 */
const findOrCreatePlace = async (placeName) => {
  try {
    // Buscamos en la BD por nombre
    let place = await Place.findOne({ name: new RegExp(placeName, 'i') });
    if (place) {
      return { status: 200, message: 'PLACE_ALREADY_EXISTS', place };
    }

    // Si no está por nombre, buscamos en Nominatim para obtener coordenadas
    const response = await axios.get(`${process.env.NOMINATIM_BASE_URL}/search`, {
      params: {
        q: placeName,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
    });

    if (response.data.length === 0) {
      throw { status: 404, message: 'NO_RESULTS_IN_NOMINATIM' };
    }

    const data = response.data[0];
    const coordinates = [parseFloat(data.lon), parseFloat(data.lat)];

    // Buscamos en la BD por coordenadas antes de crear un nuevo lugar
    place = await Place.findOne({ 'location.coordinates': coordinates });
    if (place) {
      return { status: 200, message: 'PLACE_ALREADY_EXISTS', place };
    }

    // Si no existe, lo creamos y lo guardamos en la BD
    place = await Place.create({
      name: data.display_name.split(',')[0],
      location: { type: 'Point', coordinates },
      address: data.display_name,
      country: data.address?.country || 'Desconocido',
      city: data.address?.city || data.address?.town || 'Desconocido',
      category: data.type,
      visitedBy: [],
    });
    return { status: 201, message: 'PLACE_CREATED_SUCCESSFULLY', place };
  } catch (error) {
    console.error('❌ Error en findOrCreatePlace con Nominatim:', error.message);
    throw error;
  }
};
/**
 * Obtiene una lista de lugares ordenados por el número de usuarios que los han visitado.
 * @returns {Array} - Lista de lugares.
 */
const getPlaces = async () => {
  try {
    const places = await Place.find({}).sort({ visitedBy: -1 });
    if (!places) {
      throw { status: 404, message: 'NO_PLACES_FOUND' };
    }
    return places;
  } catch (error) {
    console.error('❌ Error en getPlaces:', error);
    throw error;
  }
};

/**
 * Obtiene un lugar por su ID.
 * @param {ObjectId} placeId - ID del lugar a buscar.
 * @returns {Object|null} - Lugar encontrado o null si no existe.
 */
const getPlaceById = async (placeId) => {
  try {
    const place = await Place.findById(placeId);
    if (!place) throw { status: 404, message: 'PLACE_NOT_FOUND' };
    return place;
  } catch (error) {
    console.error('❌ Error en getPlaceById:', error);
    throw error;
  }
};

module.exports = { findOrCreatePlace, getPlaces, getPlaceById };

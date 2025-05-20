const Place = require('../models/nosql/place');

const applyUserPlaceFilters = async (query, category = null, status = null) => {
  if (category) {
    const places = await Place.find({ category }).select('_id');
    const placeIds = places.map((place) => place._id);
    query.place = { $in: placeIds };
  }
  if (status) {
    query.status = status;
  }
  return query;
};

module.exports = { applyUserPlaceFilters };

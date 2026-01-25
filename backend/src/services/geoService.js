const User = require("../models/User");

/**
 * Find nearby users by coordinates using 2dsphere index
 * @param {Number} longitude
 * @param {Number} latitude
 * @param {Number} radiusKm
 */
const findNearbyUsers = async (longitude, latitude, radiusKm = 5) => {
  const radiusMeters = radiusKm * 1000;

  const users = await User.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [longitude, latitude] },
        $maxDistance: radiusMeters,
      },
    },
    isActive: true,
  }).select("_id name email location");

  return users;
};

module.exports = { findNearbyUsers };

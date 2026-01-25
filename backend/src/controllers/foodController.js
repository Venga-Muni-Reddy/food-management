const Food = require("../models/Food");
const { successResponse, errorResponse } = require("../utils/response");
const { findNearbyUsers } = require("../services/geoService");
const {
  createNotificationsForUsers,
} = require("../services/notificationService");

// ✅ POST /api/foods
const createFood = async (req, res) => {
  try {
    const {
      title,
      description,
      quantity,
      unit,
      foodType,
      expiresAt,
      pickupAddress,
      latitude,
      longitude,
      images = [],
    } = req.body;

    if (!title || !quantity || !expiresAt || !pickupAddress) {
      return errorResponse(
        res,
        "title, quantity, expiresAt, pickupAddress are required",
        400
      );
    }

    if (latitude == null || longitude == null) {
      return errorResponse(res, "latitude and longitude are required", 400);
    }

    const food = await Food.create({
      donorId: req.user._id,
      title,
      description,
      quantity,
      unit,
      foodType,
      expiresAt,
      pickupAddress,
      pickupLocation: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
      images,
    });

    // ✅ Find nearby users within 5km
    const nearbyUsers = await findNearbyUsers(
      Number(longitude),
      Number(latitude),
      5
    );
    console.log("✅ Food Coordinates:", Number(longitude), Number(latitude));
    console.log("✅ Nearby Users Found:", nearbyUsers.length);
    console.log("✅ Nearby Users IDs:", nearbyUsers.map((u) => u._id));

    // ✅ Don't notify donor
    const filteredUsers = nearbyUsers.filter(
      (u) => String(u._id) !== String(req.user._id)
    );
    console.log("✅ Filtered Users Count:", filteredUsers.length);

    const message = `🍲 Food Available: ${title} at ${pickupAddress}`;

    const notifications = await createNotificationsForUsers({
      users: filteredUsers,
      foodId: food._id,
      message,
    });

    return successResponse(res, "Food posted successfully", {
      food,
      notifiedUsersCount: notifications.length,
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// ✅ GET /api/foods/mine
const myFoods = async (req, res) => {
  try {
    const foods = await Food.find({ donorId: req.user._id }).sort({
      createdAt: -1,
    });

    return successResponse(res, "My foods fetched", foods);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { createFood, myFoods };

const Notification = require("../models/Notifications");
const Food = require("../models/Food");
const { successResponse, errorResponse } = require("../utils/response");

// ✅ GET /api/notifications
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .populate("foodId")
      .sort({ createdAt: -1 });

    return successResponse(res, "Notifications fetched", notifications);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// ✅ PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notif) return errorResponse(res, "Notification not found", 404);

    notif.status = "READ";
    await notif.save();

    return successResponse(res, "Notification marked as READ", notif);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// ✅ POST /api/notifications/:id/accept
const acceptFoodFromNotification = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notif) return errorResponse(res, "Notification not found", 404);

    const food = await Food.findById(notif.foodId);
    if (!food) return errorResponse(res, "Food not found", 404);

    if (food.status !== "AVAILABLE") {
      return errorResponse(res, "Food is not available now", 400);
    }

    // ✅ Accept food
    food.status = "ACCEPTED";
    food.acceptedBy = req.user._id;
    food.acceptedAt = new Date();
    await food.save();

    // ✅ Update accepted notification
    notif.status = "ACCEPTED";
    await notif.save();

    // ✅ Cancel other user notifications for same food
    await Notification.updateMany(
      { foodId: food._id, userId: { $ne: req.user._id } },
      { $set: { status: "CANCELLED" } }
    );

    return successResponse(res, "Food accepted successfully", {
      food,
      notification: notif,
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getMyNotifications, markAsRead, acceptFoodFromNotification };

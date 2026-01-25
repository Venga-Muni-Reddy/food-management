const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getMyNotifications,
  markAsRead,
  acceptFoodFromNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.patch("/:id/read", protect, markAsRead);
router.post("/:id/accept", protect, acceptFoodFromNotification);

module.exports = router;

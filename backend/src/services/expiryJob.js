const cron = require("node-cron");
const Food = require("../models/Food");
const Notification = require("../models/Notifications");

const startFoodExpiryJob = () => {
  // runs every 1 minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const expiredFoods = await Food.find({
        status: "AVAILABLE",
        expiresAt: { $lte: now },
      });

      if (expiredFoods.length === 0) return;

      const foodIds = expiredFoods.map((f) => f._id);

      await Food.updateMany(
        { _id: { $in: foodIds } },
        { $set: { status: "EXPIRED" } }
      );

      await Notification.updateMany(
        { foodId: { $in: foodIds }, status: { $in: ["UNREAD", "READ"] } },
        { $set: { status: "EXPIRED" } }
      );

      console.log(`⏳ Expired foods updated: ${foodIds.length}`);
    } catch (err) {
      console.log("❌ Expiry job error:", err.message);
    }
  });
};

module.exports = { startFoodExpiryJob };

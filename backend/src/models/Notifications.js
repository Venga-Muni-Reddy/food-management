const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    message: {
      type: String,
      default: "Food is available near your location!",
    },

    status: {
      type: String,
      enum: ["UNREAD", "READ", "ACCEPTED", "EXPIRED", "CANCELLED"],
      default: "UNREAD",
    },

    distanceKm: { type: Number },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ foodId: 1 });

module.exports = mongoose.model("Notification", notificationSchema);

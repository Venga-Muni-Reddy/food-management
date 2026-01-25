const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String },

    quantity: { type: Number, required: true },
    unit: { type: String, default: "plates" },

    foodType: {
      type: String,
      enum: ["VEG", "NON_VEG", "OTHER"],
      default: "OTHER",
    },

    cookedAt: { type: Date },
    expiresAt: { type: Date, required: true },

    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    pickupAddress: { type: String, required: true },

    images: [{ type: String }],

    status: {
      type: String,
      enum: ["AVAILABLE", "ACCEPTED", "COMPLETED", "EXPIRED", "CANCELLED"],
      default: "AVAILABLE",
    },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

foodSchema.index({ pickupLocation: "2dsphere" });

module.exports = mongoose.model("Food", foodSchema);

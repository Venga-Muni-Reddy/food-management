const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    phone: { type: String },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    location: {
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

    address: { type: String },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);

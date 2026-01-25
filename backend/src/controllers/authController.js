const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, address, latitude, longitude } =
      req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Name, Email, Password are required", 400);
    }

    if (latitude == null || longitude == null) {
      return errorResponse(res, "Latitude and Longitude are required", 400);
    }

    const existing = await User.findOne({ email });
    if (existing) return errorResponse(res, "Email already exists", 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    });

    return successResponse(
      res,
      "Signup successful",
      {
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      201
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// ✅ POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and Password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, "Invalid credentials", 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid credentials", 401);

    // ✅ Update location on login (optional)
    // if (latitude != null && longitude != null) {
    //   user.location = {
    //     type: "Point",
    //     coordinates: [Number(longitude), Number(latitude)],
    //   };
    //   await user.save();
    // }

    return successResponse(res, "Login successful", {
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { signup, login };

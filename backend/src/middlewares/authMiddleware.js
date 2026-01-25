const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse } = require("../utils/response");

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return errorResponse(res, "No token provided", 401);
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return errorResponse(res, "User not found", 401);

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, "Invalid token", 401);
  }
};

module.exports = { protect };

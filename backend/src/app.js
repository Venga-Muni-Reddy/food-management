const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // ✅ frontend URL
    credentials: true,               // ✅ allow cookies
  }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Food Waste Platform API is running ✅" });
});

app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;

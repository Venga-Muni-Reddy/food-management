require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");
const { startFoodExpiryJob } = require("./src/services/expiryJob");
const User = require("./src/models/User");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // ✅ Ensure indexes are created (important for geo search)
  await User.syncIndexes();
  console.log("✅ User indexes synced");

  app.listen(PORT, () => {
    console.log(`✅ Backend running on port ${PORT}`);
  });

  startFoodExpiryJob();
};

startServer();

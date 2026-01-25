const Notification = require("../models/Notifications");

const createNotificationsForUsers = async ({ users, foodId, message }) => {
  if (!users || users.length === 0) return [];

  const docs = users.map((u) => ({
    userId: u._id,
    foodId,
    message,
    status: "UNREAD",
  }));

  const created = await Notification.insertMany(docs);
  return created;
};

module.exports = { createNotificationsForUsers };

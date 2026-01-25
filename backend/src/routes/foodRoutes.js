const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createFood, myFoods } = require("../controllers/foodController");
const router = express.Router();

router.post("/", protect, createFood);
router.get("/mine", protect, myFoods);

module.exports = router;

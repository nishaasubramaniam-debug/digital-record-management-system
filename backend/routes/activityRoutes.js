const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  getRecentActivities,
} = require("../controllers/activityController");

router.get("/", auth, getRecentActivities);

module.exports = router;
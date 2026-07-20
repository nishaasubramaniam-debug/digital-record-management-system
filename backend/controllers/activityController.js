const Activity = require("../models/Activity");

exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(activities);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
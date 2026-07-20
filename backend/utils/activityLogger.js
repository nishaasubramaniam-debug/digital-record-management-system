const Activity = require("../models/Activity");

const logActivity = async (userId, action, documentTitle = "") => {
  try {
    await Activity.create({
      user: userId,
      action,
      documentTitle,
    });
  } catch (error) {
    console.log("Activity Log Error:", error.message);
  }
};

module.exports = logActivity;
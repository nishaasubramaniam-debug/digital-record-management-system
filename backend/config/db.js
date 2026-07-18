const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log("✅ MongoDB Connected Successfully");

  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.log(error.message);
  }
};

module.exports = connectDB;
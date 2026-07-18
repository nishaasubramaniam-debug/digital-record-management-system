const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");


const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Serve uploaded documents
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);


// Connect Database
connectDB();


// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/documents", documentRoutes);


// Home Route
app.get("/", (req, res) => {

    res.send("Digital Record Management System Backend is running successfully");

});


// Server Port
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(`🚀 Server is running on http://localhost:${PORT}`);

});
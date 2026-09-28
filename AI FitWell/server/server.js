const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const authRoutes = require("./Routes/authRoutes");
const progressRoutes = require("./Routes/progressRoutes");
const feedbackRoutes = require("./Routes/feedbackRoutes");
const workoutRoutes = require("./Routes/workoutRoutes");
const aiRoutes = require("./Routes/aiRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/ai", aiRoutes);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(5000, () => {
            console.log("Server running on http://localhost:5000");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
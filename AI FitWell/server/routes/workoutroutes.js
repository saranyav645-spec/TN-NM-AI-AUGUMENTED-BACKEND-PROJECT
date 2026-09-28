const express = require("express");
const Workout = require("../models/Workout");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            workoutName,
            category,
            duration,
            calories
        } = req.body;

        if (
            !workoutName ||
            !category ||
            duration === undefined ||
            calories === undefined
        ) {
            return res.status(400).json({
                message: "Workout name, category, duration and calories are required"
            });
        }

        if (isNaN(duration) || isNaN(calories)) {
            return res.status(400).json({
                message: "Duration and calories must be numbers"
            });
        }

        if (Number(duration) <= 0 || Number(calories) < 0) {
            return res.status(400).json({
                message: "Please enter valid workout values"
            });
        }

        const workout = new Workout({
            userId: req.user.userId,
            workoutName,
            category,
            duration: Number(duration),
            calories: Number(calories)
        });

        await workout.save();

        res.status(201).json({
            message: "Workout added successfully",
            workout
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to add workout"
        });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const workouts = await Workout
            .find({ userId: req.user.userId })
            .sort({ date: -1 });

        res.json(workouts);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to load workouts"
        });
    }
});

module.exports = router;
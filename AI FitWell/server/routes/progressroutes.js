const express = require("express");
const Progress = require("../models/Progress");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// SAVE PROGRESS
// =========================

router.post("/", authMiddleware, async (req, res) => {
    try {

        const {
            weight,
            exercise,
            water
        } = req.body;


        // Validate required fields
        if (
            weight === undefined ||
            exercise === undefined ||
            water === undefined
        ) {
            return res.status(400).json({
                message: "Weight, exercise and water are required"
            });
        }


        // Validate numeric values
        if (
            isNaN(weight) ||
            isNaN(exercise) ||
            isNaN(water)
        ) {
            return res.status(400).json({
                message: "Progress values must be numbers"
            });
        }


        // Validate positive values
        if (
            Number(weight) <= 0 ||
            Number(exercise) < 0 ||
            Number(water) < 0
        ) {
            return res.status(400).json({
                message: "Please enter valid progress values"
            });
        }


        // Get user ID from verified JWT
        const userId = req.user.userId;


        const progress = new Progress({
            userId,
            weight: Number(weight),
            exercise: Number(exercise),
            water: Number(water)
        });


        await progress.save();


        res.status(201).json({
            message: "Progress saved successfully",
            progress
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to save progress"
        });

    }
});


// =========================
// GET USER PROGRESS HISTORY
// =========================

router.get("/:userId", authMiddleware, async (req, res) => {
    try {

        // Make sure the requested user is the logged-in user
        if (req.params.userId !== req.user.userId) {
            return res.status(403).json({
                message: "Access denied."
            });
        }


        const progress = await Progress
            .find({ userId: req.user.userId })
            .sort({ date: -1 });


        res.json(progress);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to load progress"
        });

    }
});


module.exports = router;
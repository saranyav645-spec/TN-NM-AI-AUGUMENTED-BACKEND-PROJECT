const express = require("express");
const Feedback = require("../models/Feedback");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// SAVE FEEDBACK
// =========================

router.post("/", authMiddleware, async (req, res) => {
    try {

        const {
            name,
            rating,
            feedback
        } = req.body;


        // Validate required fields
        if (!name || rating === undefined || !feedback) {
            return res.status(400).json({
                message: "Name, rating and feedback are required"
            });
        }


        // Validate rating
        const ratingNumber = Number(rating);

        if (
            !Number.isInteger(ratingNumber) ||
            ratingNumber < 1 ||
            ratingNumber > 5
        ) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }


        // Get user ID from verified JWT
        const userId = req.user.userId;


        const newFeedback = new Feedback({
            userId,
            name,
            rating: ratingNumber,
            feedback
        });


        await newFeedback.save();


        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback: newFeedback
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to save feedback"
        });

    }
});


// =========================
// GET USER FEEDBACK
// =========================

router.get("/:userId", authMiddleware, async (req, res) => {
    try {

        // Make sure the requested user is the logged-in user
        if (req.params.userId !== req.user.userId) {
            return res.status(403).json({
                message: "Access denied."
            });
        }


        const feedback = await Feedback
            .find({ userId: req.user.userId })
            .sort({ date: -1 });


        res.json(feedback);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to load feedback"
        });

    }
});


module.exports = router;
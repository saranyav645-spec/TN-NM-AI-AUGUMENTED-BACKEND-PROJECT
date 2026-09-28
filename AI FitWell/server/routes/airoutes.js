const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { generateAIResponse } = require("../services/geminiService");

const router = express.Router();

router.post("/chat", authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const reply = await generateAIResponse(message.trim());

        res.json({
            message: "AI response generated successfully",
            reply
        });

    } catch (error) {
        console.error("Gemini AI Error:", error);

        res.status(500).json({
            message: "Unable to generate AI response"
        });
    }
});

module.exports = router;
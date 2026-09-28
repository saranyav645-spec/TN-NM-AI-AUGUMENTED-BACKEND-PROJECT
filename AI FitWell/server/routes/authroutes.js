const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// REGISTER USER
// =========================

router.post("/register", async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            age,
            gender,
            height,
            weight,
            fitnessGoal,
            activityLevel,
            dietaryPreference
        } = req.body;


        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }


        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }


        // Validate email
        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Please enter a valid email"
            });
        }


        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            height,
            weight,
            fitnessGoal,
            activityLevel,
            dietaryPreference
        });


        await user.save();


        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }
});


// =========================
// LOGIN USER
// =========================

router.post("/login", async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }


        const user = await User.findOne({ email });


        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }


        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }


        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id.toString()
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        res.json({
            message: "Login successful",
            userId: user._id,
            token
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }
});


// =========================
// GET PROFILE
// =========================

router.get("/profile/:id", authMiddleware, async (req, res) => {
    try {

        // Only allow the logged-in user
        if (req.params.id !== req.user.userId) {
            return res.status(403).json({
                message: "Access denied."
            });
        }


        const user = await User
            .findById(req.user.userId)
            .select("-password");


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        res.json(user);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }
});


// =========================
// UPDATE PROFILE
// =========================

router.put("/profile/:id", authMiddleware, async (req, res) => {
    try {

        // Only allow the logged-in user
        if (req.params.id !== req.user.userId) {
            return res.status(403).json({
                message: "Access denied."
            });
        }


        const {
            name,
            email,
            age,
            height,
            weight
        } = req.body;


        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }


        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Please enter a valid email"
            });
        }


        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                name,
                email,
                age,
                height,
                weight
            },
            {
                new: true
            }
        ).select("-password");


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        res.json({
            message: "Profile updated successfully",
            user
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }
});


module.exports = router;
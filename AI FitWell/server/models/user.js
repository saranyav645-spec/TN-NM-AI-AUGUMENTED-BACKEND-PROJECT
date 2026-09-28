const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    age: {
        type: Number,
        min: 1
    },

    gender: {
        type: String,
        trim: true
    },

    height: {
        type: Number,
        min: 1
    },

    weight: {
        type: Number,
        min: 1
    },

    fitnessGoal: {
        type: String,
        trim: true
    },

    activityLevel: {
        type: String,
        trim: true
    },

    dietaryPreference: {
        type: String,
        trim: true
    }

});

module.exports = mongoose.model("User", userSchema);

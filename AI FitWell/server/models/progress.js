const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    weight: {
        type: Number,
        required: true,
        min: 1
    },

    exercise: {
        type: Number,
        required: true,
        min: 0
    },

    water: {
        type: Number,
        required: true,
        min: 0
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Progress", progressSchema);
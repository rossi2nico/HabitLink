// Mongoose: schema model for habit
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const habitSchema = new Schema({
    name: {
        type: String,
        maxlength: 25,
        required: true
    },
    description: {
        type: String,
        maxlength: 140,
        default: function() {
            return this.name;
        }
    },
    // Modify this to specific days of the week?
    frequency: {
        type: Number,
        default: 7,
    },
    streak: {
        type: Number,
        default: 0
    },
    maxStreak: {
        type: Number,
        default: 0
    },
    streakLastUpdated: {
        type: Date
    },
    completions: [{
        type: Date
    }],
    syncedHabits: [{
        habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    privacy: { // 0 = private, 1 = friends-only, 2 = public
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
}, { timestamps: true})

module.exports = mongoose.model("Habit", habitSchema)
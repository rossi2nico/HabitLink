// Mongoose: schema model for habit
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const habitSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: function() {
            return this.name;
        }
    },
    // 7 = daily
    frequency: {
        type: Number,
        required: true
    },
    streak: {
        type: Number,
        default: 0
    },
    maxStreak: {
        type: Number,
        default: 0
    },
    datesCompleted: [{
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
    }
}, { timestamps: true})

module.exports = mongoose.model("Habit", habitSchema)
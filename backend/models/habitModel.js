const mongoose = require('mongoose')
const Schema = mongoose.Schema

const habitSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    name: { type: String, maxlength: 25, required: true },
    privacy: { type: Number, default: 0 }, // 0 = private, 1 = friends-only, 2 = public

    completions: [{ type: Date }],
    syncedHabits: [{
        habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String }
    }],

    description: { type: String, maxlength: 140, default: function () { return this.name } },
    frequency: { type: Number, default: 7 },

    streak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    streakLastUpdated: { type: Date },
    totalCompletions: { type: Number },
    potentialCompletions: { type: Number },

    username: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("Habit", habitSchema)
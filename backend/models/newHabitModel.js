const mongoose = require("mongoose")
const Schema = mongoose.Schema

const newHabitSchema = new Schema({
  /* Define the most important features first, then implement additional features over time*/
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, maxLength: 25, required: true},
  completions: { type: Map, of: Number, default: {} },
  privacy: { type: Number, enum: [0, 1, 2], default: 0 },
  /* Habit linking features */
  parentHabitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit2', default: null },
  linkedHabits: [{ 
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit2', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerUsername: { type: String, required: true }
  }],
  /* Calculation features */
  streak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  streakLastUpdated: { type: String, default: null }, // "Storing local date string 2025-09-02"
  startDate: { type: String, required: true } 
})

module.exports = mongoose.model("Habit2", newHabitSchema)
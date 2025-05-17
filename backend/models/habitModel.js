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
    // Frequency: times per week (daily habit is 7)
    frequency: {
        type: Number,
        required: true
    },
    streak: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    }
    /* Future implementation ideas

    friendsSharedWith: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' }],
    progress: [{
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' },
        completed: { 
            type: Boolean, 
            default: false },
        date: { 
            type: Date, 
            default: Date.now },
        streak: { 
            type: Number, 
            default: 0 } 
    }]
    */
}, { timestamps: true})

module.exports = mongoose.model("Habit", habitSchema)
const mongoose = require("mongoose")

const Habit2 = require('../models/newHabitModel')
const User = require('../models/userModel')

const { format, parse } = require('date-fns')


const createHabit2 = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, privacy, startDate } = req.body;

    if (!name) throw new Error('Habit name is required');
    const trimmedName = name.trim();
    if (trimmedName.length === 0) throw new Error('Habit name cannot be empty');
    if (trimmedName.length > 25) throw new Error('Habit name must be 25 characters or less');
    
    const habit = await Habit2.create({ userId, name: trimmedName, privacy, startDate })
    res.status(200).json(habit);
  } 
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteHabit2 = async (req, res) => {  
    try {
        const userId = req.user._id;
        const { habitId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(habitId)) throw new Error('Invalid habit ID')
        const habit = await Habit2.findById(habitId)
        if (!habit) throw new Error('Invalid habit ID')
        
        await habit.deleteOne();
        return res.status(200).json(habit)
    } 
    catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const toggleComplete2 = async (req, res) => {
  try {
    const { completionDate, currentDate, valueCompleted } = req.body;
    const { habitId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(habitId)) throw new Error('Invalid habit ID format');
    const habit = await Habit2.findById(habitId);
    if (!habit) throw new Error('Habit not found');
    if (!valueCompleted) throw new Error('No completion value provided')
    if (habit.userId.toString() !== req.user._id.toString()) throw new Error('Not authorized to modify this habit');
    
    // Receive local date string from frontend YYYY-MM-DD

    if (habit.completions.has(completionDate)) {
        habit.completions.delete(completionDate)
        await habit.save()
        return res.status(200).json(habit)
    } else {
        habit.completions.set(completionDate, valueCompleted)
        await habit.save()
        return res.status(200).json(habit)
    }
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
    createHabit2, deleteHabit2,
    // deleteHabit, updateHabit, 
    // getHabit, getHabits, getPublicHabits, getTargetHabits, getFriendHabits, getSyncedHabits,
    // syncHabit,
    toggleComplete2
}
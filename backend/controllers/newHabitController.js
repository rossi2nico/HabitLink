const mongoose = require("mongoose")

const Habit2 = require('../models/newHabitModel')
const User = require('../models/userModel')

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

/* currentDate */
const getHabits2 = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentDate } = req.body
        console.log("current date:", currentDate)
        const habits = await Habit2.find({ userId }).sort({ createdAt: -1 });

        for (const habit of habits) {
            const lastUpdated = habit.streakLastUpdated ? habit.streakLastUpdated : null;
            if (!lastUpdated || !(currentDate === lastUpdated)) {
                await calculateStreak(habit, currentDate) // Current implementation is n * nlogn (optimize later)
            }
        }
        return res.status(200).json(habits)
    }
    catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getUTCMonth() === d2.getUTCMonth() &&
        d1.getUTCDate() === d2.getUTCDate();
};

const calculateStreak = async (habit, currentDate) => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    habit.streakLastUpdated = currentDate;

    if (!habit.completions || habit.completions.size === 0) {
        habit.streak = 0;
        habit.maxStreak = 0;
        await habit.save();
        return
    }
    // Converted Map to Object(date, completionValue)
    const completionDates = Array.from(habit.completions.entries())
        .filter(([date]) => date <= currentDate)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, completionValue]) => ({ date, completionValue })); 

    const lastCompleted = new Date(completionDates[0].date)
    const today = new Date(currentDate)

    const daysMissed = (today - lastCompleted) / MS_PER_DAY;
    if (daysMissed > 1) {
        habit.streak = 0;
        await habit.save(); 
        return;
    }

    const date = new Date(today)
    if (!isSameDate(date, lastCompleted)) {
        date.setDate(date.getDate() - 1);
    }

    let streak = 0
    for (let i = 0; i < completionDates.length; i++) {
        const completionDate = new Date(completionDates[i].date);
        const completionValue = completionDates[i].completionValue
        if (isSameDate(completionDate, date) && completionValue > 0) {
            streak++;
            date.setDate(date.getDate() - 1);
        } else break
    }

    habit.maxStreak = Math.max(streak, habit.maxStreak);
    habit.streak = streak;
    await habit.save()
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
        await calculateStreak(habit, currentDate)
        await habit.save()
        return res.status(200).json(habit)
    } else {
        habit.completions.set(completionDate, valueCompleted)
        await calculateStreak(habit, currentDate)
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
    getHabits2,
    // deleteHabit, updateHabit, 
    // getHabit, getHabits, getPublicHabits, getTargetHabits, getFriendHabits, getSyncedHabits,
    // syncHabit,
    toggleComplete2
}
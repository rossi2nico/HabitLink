const Habit = require('../models/habitModel')
const mongoose = require('mongoose')

const syncHabit = async (req, res) => {
    // If a user has access to a habit, they will be able to send a sync request
    // Allow the user to choose their privacy (private will only share with the other synced user)
    const { originalHabitId, originalUserId, privacy } = req.body;
    try {
        // Get the user requesting a sync request's id
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({error: 'User ID not found!'});
        }
        // Find the original habit to by synced to
        const habit = await Habit.findById(originalHabitId);
        if (!habit) {
            return res.status(404).json({error: 'Original habit does not exist!'});
        }
        // Ensure habit is not already synced
        const alreadySynced = habit.syncedHabits.some(
            (entry) => entry.userId.toString() === userId.toString()
        );
        if (alreadySynced) {
            return res.status(409).json({error: 'Habit is already synced'})
        }
        // Create the duplicate habit
        const { name, description, frequency } = habit;
        const newHabit = await Habit.create({name, description, frequency, privacy, userId});
        if (!newHabit) {
            return res.status(500).json({error: 'Error creating synced habit'})
        }
        // Add habits to corresponding syncedHabits list
        habit.syncedHabits.push({
            habitId: newHabit._id,
            userId: userId
        })
        newHabit.syncedHabits.push({
            habitId: originalHabitId,
            userId: originalUserId
        })
        await habit.save();
        await newHabit.save();

        res.status(200).json({ newHabit })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const createHabit = async (req, res) => {
    // Name, description, privacy, frequency, userId
    const { name, description, privacy, frequency } = req.body;
    try {
        const userId = req.user._id;
        if (!userId) return res.status(400);
        const habit = await Habit.create({name, description, privacy, frequency, userId});
        res.status(200).json(habit);
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getHabit = async (req, res) => {
    
    const { habitId } = req.params
    if(!mongoose.Types.ObjectId.isValid(habitId)) {
        return res.status(404).json({error: 'No such habit'})
    }

    const habit = await Habit.findById(habitId)
    if (!habit) {
        return res.status(404).json({error: 'No habit found'})
    }

    res.status(200).json(habit)
}

const getHabits = async (req, res) => {
    const habits = await Habit.find({}).sort({createdAt: -1});
    res.status(200).json(habits)
}

const deleteHabit = async (req, res) => {
    const { habitId } = req.params

    if (!mongoose.Types.ObjectId.isValid(habitId)) {
        return res.status(404).json({error: "Habit not found"})
    }

    const habit = await Habit.findOneAndDelete({_id: habitId});

    if (!habit) {
        return res.status(404).json({error: "Habit not found"})
    }

    res.status(200).json(habit)
}

const updateHabit = async (req, res) => {

    const { habitId } = req.params
    if (!mongoose.Types.ObjectId.isValid(habitId)) {
        return res.statsus(404).json({error: "Habit not found"})
    }

    const habit = await Habit.findOneAndUpdate({_id: habitId}, {
        ...req.body
    })
    if (!habit) {
        return res.status(404).json({error: "Habit not found"})
    }

    res.status(200).json(habit)
}

const calculateStreaks = async (req, res) => {

}

module.exports = {
    createHabit,
    getHabit, getHabits,
    deleteHabit,
    updateHabit,
    syncHabit
}

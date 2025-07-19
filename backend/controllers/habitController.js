const Habit = require('../models/habitModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const sameDate = (d1, d2) => {

    if (d1 === null || d2 === null) return false;
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    )
}

const calculateStreak = async (habit) => {
    const completions = habit.completions.map((d) => new Date(d))

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    habit.streakLastUpdated = today;
    await habit.save();

    if (completions.length === 0) {
        habit.streak = 0;
        habit.maxStreak = 0;
        await habit.save();
        return;
    }

    const lastCompleted = completions[completions.length -1]
    const daysMissed = (today - lastCompleted) / (1000 * 60 * 60 * 24)

    if (daysMissed > 1) {
        habit.streak = 0;
        await habit.save(); 
        return;
    }
    // Recalculate streak backward from today or yesterday
    let day = new Date(today);
    if (!sameDate(today, lastCompleted)) {
        day.setDate(day.getDate() - 1);
    }
    let streak = 0;
    let totalCompletions = 0;

    for (let i = completions.length - 1; i >= 0; i--) {
        const date = completions[i];
        if (sameDate(date, day)) {
            totalCompletions++;
            streak++;
            day.setDate(day.getDate() - 1);
        }
        else {
            break;
        }
    }
    
    let maxStreak = 0;
    let cur = 0;

    for (let i = completions.length - 1; i >= 0; i--) {
        const date = completions[i];

        if (i === completions.length - 1) {
            cur = 1;
        } else {
            const prevDate = completions[i + 1]; 
            const expectedDate = new Date(prevDate);
            expectedDate.setDate(expectedDate.getDate() - 1);
            expectedDate.setHours(0, 0, 0, 0);

            if (sameDate(date, expectedDate)) {
                cur++;
            } else {
                if (cur > maxStreak) maxStreak = cur;
                cur = 1;
            }
        }
    }
    if (cur > maxStreak) maxStreak = cur;

    day = new Date(today);
    if (!sameDate(today, lastCompleted)) {
        day.setDate(day.getDate() - 1);
    }
    let startDay = new Date(habit.createdAt);
    startDay.setHours(0, 0, 0, 0);
    const potentialCompletions = Math.floor((day - startDay) / (1000 * 60 * 60 * 24) + 1);

    if (!habit.timesCompleted || typeof habit.timesCompleted !== 'object') {
        habit.timesCompleted = { completions: 0, days: 0 };
    }

    habit.totalCompletions = totalCompletions;
    habit.potentialCompletions = potentialCompletions;
    habit.streak = streak;
    habit.maxStreak = maxStreak;
    await habit.save();
    return;
}

const updateHabit = async (req, res) => {

    const { habitId } = req.params;
    console.log("habitId:", habitId);
    if (!mongoose.Types.ObjectId.isValid(habitId)) {
        return res.status(404).json({error: "Habit not found"})
    }

    const { ...updates } = req.body;
    const notSynced = (habit) => !habit.synced || habit.synced.length === 0; 

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(400).json({ error: 'Habit not found' });
        }

        if (!notSynced(habit)) {
            return res.status(400).json( { error: 'Habit is shared with other users, can not edit' })
        }

        for (let key in updates) {
            if (key === "name") {
                if (updates[key].length > 25) {
                    return res.status(400).json({ error: 'Habit name must be 25 characters or less' });
                }
            }
            if (key === "description") {
                if (updates[key].length > 140) {
                    return res.status(400).json({ error: 'Habit description must be 140 characters or less' })
                }
            }
            habit[key] = updates[key];
            await habit.save();
        }

        res.status(200).json(habit);

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getSyncedHabits = async (req, res) => {
    
    const { habitId } = req.params;

    try {
        const habit = await Habit.findById(habitId).populate('syncedHabits.habitId', 'streak maxStreak totalCompletions potentialCompletions completions username');
        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' })
        }
        const syncedHabits = habit.syncedHabits;
        return res.status(200).json({ syncedHabits }); // Returns json.syncedHabits -> { "syncedHabits": [], otherVariables needed etc }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const toggleComplete = async (req, res) => {

    const today = new Date();
    const { habitId } = req.body;

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(400).json( { error: 'Habit not found' });
        }        
        
        const len = habit.completions.length;

        if (len === 0) {
            habit.completions.push(today);
            await calculateStreak(habit);
            await habit.save()
            return res.status(200).json({ habit })
        }

        const lastItem = new Date(habit.completions[len - 1]);
        if (sameDate(lastItem, today)) {
            habit.completions.pop();
            await calculateStreak(habit);
            await habit.save();
            return res.status(200).json({ habit })
        }
        habit.completions.push(today);
        await calculateStreak(habit);
        await habit.save();
        res.status(200).json({ habit })

    }
    catch (error) {
        res.status(400).json({ error: error.message }) 
    }
}

const syncHabit = async (req, res) => {
 
    const { originalHabitId, privacy } = req.body;
    try {
        // Get the user requesting a sync request's id
        const userId = req.user._id;
        const username = req.user.username;
        if (!userId) {
            return res.status(400).json({error: 'User ID not found!'});
        }
        // Find the original habit to by synced to
        const habit = await Habit.findById(originalHabitId);
        if (!habit) {
            return res.status(404).json({error: 'Original habit does not exist!'});
        }
        const originalUserId = habit.userId;
        const originalUsername = habit.username;
        if (originalUserId.toString() === userId.toString()) {
            return res.status(409).json( {error: 'Cant sync with own habit' })
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
        const newHabit = await Habit.create({name, description, frequency, privacy, userId, username});
        if (!newHabit) {
            return res.status(500).json({error: 'Error creating synced habit'})
        }
        // Add habits to corresponding syncedHabits list
        habit.syncedHabits.push({
            habitId: newHabit._id,
            userId: userId,
            username: username
        })
        newHabit.syncedHabits.push({
            habitId: originalHabitId,
            userId: originalUserId,
            username: originalUsername
        })
        await habit.save();
        await newHabit.save();

        res.status(200).json(newHabit)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const createHabit = async (req, res) => {
    // Name, description, privacy, frequency, userId
    const { name, description, privacy, frequency } = req.body;
    if (name.length > 25)  {
        return res.status(400).json({ error: 'habit name must be 25 characters or less'})
    }
    if (name.trim().length == 0) {
        return res.status(400).json({ error: 'habit name can not be empty'})
    }
    if (description && description.length > 140) {
        return res.status(400).json({ error: 'description must be 140 characters or less'})
    }
    try {
        const userId = req.user._id;
        const username = req.user.username;
        console.log(`username${username}`)
        if (!userId) return res.status(400);
        const habit = await Habit.create({name, description, privacy, frequency, userId, username});
        habit.ownerId = userId;
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

    const userId  = req.user._id
    const habits = await Habit.find({ userId }).sort({ createdAt: 1 });

    const today = new Date()
    
    for (const habit of habits) {
        if (!sameDate(new Date(habit.streakLastUpdated), today)) {
            console.log('Calculating streak')
            await calculateStreak(habit);
            await habit.save();
        }
    }

    res.status(200).json(habits)
}

const getFriendHabits = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const friendIds = user.friends
        const friendHabits = await Habit.find({
            userId: {$in: friendIds },
            privacy: { $gt: 0 }
        }).sort( { createdAt: -1 })

        const today = new Date()
    
        for (const habit of friendHabits) {
            if (!sameDate(habit.streakLastUpdated, today)) {
                console.log('Calculating streak')
                await calculateStreak(habit);
                await habit.save();
            }
        }
        
        return res.status(200).json(friendHabits);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getTargetHabits = async (req, res) => {
    const userId = req.user._id
    const targetUserId = req.params.targetUserId

    try {
        const targetUser = await User.findById(targetUserId)
        const areFriends = targetUser.friends.some(
            f => f.toString() === userId.toString()
        )
        if (areFriends) {
            // Find habits that are either public or private
            const habits = await Habit.find({ userId: targetUserId, privacy: { $gt: 0 }}).sort( { createdAt: 1 })
            return res.status(200).json(habits)
        }
        const habits = await Habit.find({ userId: targetUserId, privacy: 2 }).sort({ createdAt: 1 })
        return res.status(200).json(habits)
    }
    catch (error) {
        res.status(400).json({error: error.message })
    }
}

const getPublicHabits = async (req, res) => {
    const habits = await Habit.find({ privacy: 2 }).sort({ createdAt: 1 })
    const today = new Date()
    
    for (const habit of habits) {
        if (!sameDate(habit.streakLastUpdated, today)) {
            console.log('Calculating streak!!')
            await calculateStreak(habit);
            await habit.save();
        }
    }

    res.status(200).json(habits)
}

const deleteHabit = async (req, res) => {
    const { habitId } = req.params

    if (!mongoose.Types.ObjectId.isValid(habitId)) {
        return res.status(404).json({error: "Habit not found"})
    }

    try {
        const habit = await Habit.findById(habitId)
        if (!habit) {
            return res.status(404).json({error: "Habit not found"})
        }
        // iterate through synced arrays, find the habits and remove our habit from their synced list
        const modifiedHabits = [];

        for (const syncedHabit of habit.syncedHabits) {
            const otherHabit = await Habit.findById(syncedHabit.habitId)
            if (!otherHabit) continue;
            
            otherHabit.syncedHabits = otherHabit.syncedHabits.filter(
                otherSyncedHabits => otherSyncedHabits.habitId.toString() !== habitId.toString()
            )
            await otherHabit.save();
            modifiedHabits.push(otherHabit);
        }

        await habit.deleteOne();
        return res.status(200).json({
            deletedHabit: habit,
            updatedSyncedHabits: modifiedHabits
        })
    }
    catch (error) {
        console.error("DELETE habit error:", error); // not just error.message
        return res.status(400).json({ error: error.message })
    }
}

/*
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
*/

module.exports = {
    createHabit,
    getHabit, getHabits, getPublicHabits, getTargetHabits, getFriendHabits, getSyncedHabits,
    deleteHabit,
    updateHabit,
    syncHabit,
    toggleComplete
}

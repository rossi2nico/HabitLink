const mongoose = require("mongoose")

const Habit2 = require('../models/newHabitModel')
const User = require('../models/userModel')

const createHabit = async (req, res) => {
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

// Modify this to delete synced habits after implementing synced habits
const deleteHabit = async (req, res) => {  
    try {
        const userId = req.user._id;
        const { habitId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(habitId)) throw new Error('Invalid habit ID')
        const habit = await Habit2.findById(habitId)
        if (!habit) throw new Error('Invalid habit ID')

        const modifiedHabits = [];
        
        for (const linkedHabit of habit.linkedHabits) {
            const otherHabit = await Habit2.findById(linkedHabit.habitId)
            if (!otherHabit) continue;
            
            otherHabit.linkedHabits = otherHabit.linkedHabits.filter(
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
        return res.status(400).json({ error: error.message })
    }
}

const getHabit = async (req, res) => {
   
    const { habitId } = req.params
    const { currentDate} = req.query
    const { 'access-type': accessType } = req.headers

    try {
       
       if(!mongoose.Types.ObjectId.isValid(habitId)) {
           return res.status(400).json({error: 'Invalid habit ID'})
       }

       if (!currentDate) {
           return res.status(400).json({error: 'currentDate not included'})
       }

       const habit = await Habit2.findById(habitId)       
       if (!habit) {
           return res.status(404).json({error: 'Habit does not exist'})
       }

        if (habit.userId.toString() !== req.user.id && accessType != 'sync') {
            return res.status(403).json({error: 'Access denied'})
       }

       const lastUpdated = habit.streakLastUpdated ? habit.streakLastUpdated : null;
        if (!lastUpdated || !(currentDate === lastUpdated)) {
            await calculateStreak(habit, currentDate)
        }

       res.status(200).json(habit)
       
   } catch (error) {
       res.status(500).json({error: 'Server error'})
   }
}

/* currentDate */
const getHabits = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentDate } = req.query
        if (!currentDate) throw new Error('currentDate not included')
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
    console.log("Calculating streak for habit:", habit._id, "with currentDate:", currentDate)
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

const toggleComplete = async (req, res) => {
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
        console.log("habit after toggleComplete: ", habit)
        return res.status(200).json(habit)
    } else {
        habit.completions.set(completionDate, valueCompleted)
        await calculateStreak(habit, currentDate)
        await habit.save()
        console.log("habit after toggleComplete: ", habit)
        return res.status(200).json(habit)
    }
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const syncHabit = async (req, res) => {
    try {
        const { originalHabitId, currentDate } = req.body
        const userId = req.user._id

        const originalHabit = await Habit2.findById(originalHabitId)
        if (!originalHabit) throw new Error('Invalid habit ID')
        
        if (userId.toString() === originalHabit.userId.toString()) throw new Error("Can't sync with own habit!")

        const alreadySynced = originalHabit.linkedHabits.some(h => h.userId.toString() === userId.toString());
        if (alreadySynced) throw new Error("Habit already synced");

        let { name, privacy, parentHabitId } = originalHabit
        if (!parentHabitId) parentHabitId = originalHabitId

        const originalUserId = originalHabit.userId
        const originalUser = await User.findById(originalUserId)
        const originalOwnerUsername = originalUser.username
        const user = await User.findById(userId)
        const ownerUsername = user.username

        const habit = await Habit2.create({ userId, name, privacy, parentHabitId, startDate: currentDate })
        if (!habit) throw new Error("Create habit failed")

        originalHabit.linkedHabits.push({ habitId: habit._id, userId, ownerUsername })
        habit.linkedHabits.push({ habitId: originalHabitId, userId: originalUserId, ownerUsername: originalOwnerUsername })

        await originalHabit.save()
        await habit.save()
        return res.status(200).json({ originalHabit: originalHabit, newHabit: habit })
    }
    catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const getLinkedHabits = async (req, res) => {
    
    const { habitId } = req.params;

    try {
        const habit = await Habit2.findById(habitId).populate(
            'linkedHabits.habitId', 
            'streak maxStreak completions username' // Add potentialCompletions and totalCompletions later
        );

        if (!habit) return res.status(404).json({ error: 'Habit not found' })

        const linkedHabits = habit.linkedHabits;
        return res.status(200).json({ linkedHabits }); // Returns json.syncedHabits -> { "syncedHabits": [], otherVariables needed etc }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createHabit, deleteHabit,
    getHabits,
    syncHabit, 
    getHabit,
    getLinkedHabits,
    // getHabit, getPublicHabits, getTargetHabits, getFriendHabits, getSyncedHabits,
    toggleComplete
}
const Habit = require('../models/habitModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const sameDate = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
        d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getUTCMonth() === d2.getUTCMonth() &&
        d1.getUTCDate() === d2.getUTCDate()
    );
};

const isBeforeDay = (d1, d2) => {
  return (
    d1.getUTCFullYear() < d2.getUTCFullYear() ||
    (d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() < d2.getUTCMonth()) ||
    (d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() < d2.getUTCDate())
  );
};

const calculateStreak = async (habit) => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const completions = habit.completions;
    const today = new Date()
    today.setHours(4, 0, 0, 0)
    habit.streakLastUpdated = today;

    if (completions.length === 0) {
        habit.streak = 0;
        habit.maxStreak = 0;
        await habit.save();
        return;
    }

    const lastCompleted = completions[completions.length - 1];
    lastCompleted.setHours(4, 0, 0, 0)
    
    const daysMissed = (today - lastCompleted) / MS_PER_DAY;

    if (daysMissed >= 2) {
        habit.streak = 0;
        await habit.save(); 
        return;
    }

    let streak = 0;
    let day = new Date(today);
    day.setHours(4, 0, 0, 0);
    
    if (!sameDate(today, lastCompleted)) {
        day.setDate(day.getDate() - 1);
    }

    for (let i = completions.length - 1; i >= 0; i--) {
        const date = completions[i];
        if (sameDate(date, day)) {
            streak++;
            day.setDate(day.getDate() - 1);
        } else break;
    }

    habit.streak = streak;
    habit.totalCompletions = completions.length;

    let maxStreak = 0;
    streak = 1;
    
    for (let i = completions.length - 2; i >= 0; i--) {
        const date = completions[i];
        const prevDate = completions[i + 1]; 
        
        const expectedDate = new Date(prevDate);
        expectedDate.setDate(expectedDate.getDate() - 1);

        if (sameDate(date, expectedDate)) {
            streak++;
            continue;
        } 

        if (streak > maxStreak) maxStreak = streak;
        streak = 1;
    }

    if (streak > maxStreak) maxStreak = streak;
    habit.maxStreak = maxStreak;

    day = new Date(today);
    day.setHours(4, 0, 0, 0)
    if (!sameDate(today, lastCompleted)) {
        day.setDate(day.getDate() - 1);
    }

    let dateCreated = habit.createdAt;
    dateCreated.setHours(4, 0, 0, 0)
    const potentialCompletions = Math.floor((day - dateCreated) / MS_PER_DAY + 1);

    if (!habit.timesCompleted || typeof habit.timesCompleted !== 'object') {
        habit.timesCompleted = { completions: 0, days: 0 };
    }

    habit.potentialCompletions = potentialCompletions;
    await habit.save();
    return;
}

const calculateHabitMastery = async (habit) => {
    let habitMastery = 0
    let multiplier = 1

    const startDate = today();
    const completions = habit.completions

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
        }

        await habit.save();
        res.status(200).json(habit);

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getSyncedHabits = async (req, res) => {
    
    const { habitId } = req.params;

    try {
        const habit = await Habit.findById(habitId).populate(
            'syncedHabits.habitId', 
            'streak maxStreak totalCompletions potentialCompletions completions username'
        );

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
    const { habitId, dateCompleted } = req.body;

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(400).json({ error: 'Habit not found' });
        }      
        
        const len = habit.completions.length;
        const today = new Date();
        
        if (len === 0) {
            habit.completions.push(dateCompleted);
            habit.totalCompletions += 1;
            await calculateStreak(habit);
            await habit.save()
            return res.status(200).json({ habit })
        }

        let left = 0;
        let right = habit.completions.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const currentDate = new Date(habit.completions[mid]);

            if (sameDate(currentDate, new Date(dateCompleted))) {
                habit.totalCompletions -= 1
                if (sameDate(currentDate, today)) {
                    habit.potentialCompletions -= 1;
                }
                habit.completions.splice(mid, 1);
                await calculateStreak(habit);
                await habit.save();
                return res.status(200).json({ habit });
            }

            if (isBeforeDay(currentDate, new Date(dateCompleted))) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        habit.completions.splice(left, 0, dateCompleted);
        habit.totalCompletions += 1;
        if (sameDate(new Date(dateCompleted), today)) {
            habit.potentialCompletions += 1;
        }

        await calculateStreak(habit);
        await habit.save();
        res.status(200).json({ habit })

    } catch (error) {
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
        newHabit.createdAt.setHours(4, 0, 0 , 0)
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
        habit.createdAt.setHours(4, 0, 0, 0)
        habit.ownerId = userId;
        await habit.save()
        res.status(200).json(habit);
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getHabit = async (req, res) => {
   
    const { habitId } = req.params
    const { 'access-type': accessType } = req.headers

    try {
       
       if(!mongoose.Types.ObjectId.isValid(habitId)) {
           return res.status(400).json({error: 'Invalid habit ID'})
       }

       const habit = await Habit.findById(habitId)       
       if (!habit) {
           return res.status(404).json({error: 'Habit does not exist'})
       }

        if (habit.userId.toString() !== req.user.id && accessType != 'sync') {
            return res.status(403).json({error: 'Access denied'})
       }

       res.status(200).json(habit)
       
   } catch (error) {
       res.status(500).json({error: 'Server error'})
   }
}

const getHabits = async (req, res) => {
    const userId = req.user._id;
    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });

    const today = new Date()
    
    for (const habit of habits) {
        const lastUpdated = habit.streakLastUpdated ? habit.streakLastUpdated : null;
        if (!lastUpdated || !sameDate(lastUpdated, today)) {
            console.log('Calculating streak');
            await calculateStreak(habit);
        }
    }

    res.status(200).json(habits);
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
            const habits = await Habit.find({ userId: targetUserId, privacy: { $gt: 0 }}).sort( { createdAt: -1 })
            return res.status(200).json(habits)
        }
        const habits = await Habit.find({ userId: targetUserId, privacy: 2 }).sort({ createdAt: -1 })
        return res.status(200).json(habits)
    }
    catch (error) {
        res.status(400).json({error: error.message })
    }
}

const getPublicHabits = async (req, res) => {
    try {
        const today = new Date()
        const habits = await Habit.find({ privacy: 2 }).sort({ createdAt: -1 })

        for (const habit of habits) {
            await calculateStreak(habit)
        }

        return res.status(200).json(habits)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

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
        console.error("DELETE habit error:", error); 
        return res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createHabit,
    getHabit, getHabits, getPublicHabits, getTargetHabits, getFriendHabits, getSyncedHabits,
    deleteHabit,
    updateHabit,
    syncHabit,
    toggleComplete
}

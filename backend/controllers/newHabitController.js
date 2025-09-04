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

const toggleComplete2 = async (req, res) => {
  try {
    const { habitId, dateCompleted, currentDate, valueCompleted } = req.body;

    // if (!mongoose.Types.ObjectId.isValid(habitId)) throw new Error('Invalid habit ID format');

    const habit = await Habit2.findById(habitId);
    if (!habit) throw new Error('Habit not found');

    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to modify this habit' });
    }
    // Receive local date string from frontend YYYY-MM-DD
    const dateKey = new Date(dateCompleted).toISOString().split('T')[0];
    console.log("date key", dateKey)
    return res.status(400).json("ahhh!!")
  }
  catch (error) {
    res.status(400).json({ error: error.message })
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
        const todayMidnight = getTodayLocal();
        
        if (!dateCompleted) {
            
            if (len === 0) {
                habit.completions.push(todayMidnight);
                await calculateStreak(habit);
                await habit.save()
                return res.status(200).json({ habit })
            }

            const lastItem = new Date(habit.completions[len - 1]);
            if (sameDate(lastItem, todayMidnight)) {
                habit.completions.pop();
                habit.totalCompletions -= 1;
                await calculateStreak(habit);
                await habit.save();
                return res.status(200).json({ habit })
            }
            habit.completions.push(todayMidnight);
        }
        else {

            const targetMidnight = getLocalMidnight(new Date(dateCompleted));
            
            if (len === 0) {
                habit.completions.push(targetMidnight);
                await calculateStreak(habit);
                await habit.save()
                return res.status(200).json({ habit })
            }

            let left = 0;
            let right = habit.completions.length - 1;

            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                const currentDate = getLocalMidnight(habit.completions[mid]);

                if (currentDate.getTime() === targetMidnight.getTime()) {
                    habit.totalCompletions -= 1
                    if (currentDate.getTime() === todayMidnight.getTime()) {
                        habit.potentialCompletions -= 1;
                    }
                    habit.completions.splice(mid, 1);
                    await calculateStreak(habit);
                    await habit.save();
                    return res.status(200).json({ habit });
                }
                else if (currentDate < targetMidnight) {
                    left = mid + 1;
                }
                else {
                    right = mid - 1;
                }
            }
            
            habit.completions.splice(left, 0, targetMidnight);
        }
        
        await calculateStreak(habit);
        await habit.save();
        res.status(200).json({ habit })

    } catch (error) {
        res.status(400).json({ error: error.message }) 
    }
}

module.exports = {
    createHabit2, 
    // deleteHabit, updateHabit, 
    // getHabit, getHabits, getPublicHabits, getTargetHabits, getFriendHabits, getSyncedHabits,
    // syncHabit,
    toggleComplete2
}
const Habit = require('../models/habitModel')
const mongoose = require('mongoose')

const createHabit = async (request, response) => {

    const {name, description, frequency, streak, completed} = request.body
    try {
        const habit = await Habit.create({name, description, frequency, streak, completed})
        response.status(200).json(habit) // Repond with positive code and json
    } 
    catch (error) {
        response.status(400).json({error: error.message}) // Respond with error code and json
    }  
}

const getHabit = async (request, response) => {
    
    const { id } = request.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: 'No such habit'})
    }

    const habit = await Habit.findById(id)
    if (!habit) {
        return response.status(404).json({error: 'No habit found'})
    }

    response.status(200).json(habit)
}

const getHabits = async (request, response) => {
    const habits = await Habit.find({}).sort({createdAt: -1});
    response.status(200).json(habits)
}

const deleteHabit = async (request, response) => {
    const { id } = request.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "Habit not found"})
    }

    const habit = await Habit.findOneAndDelete({_id: id});

    if (!habit) {
        return response.status(404).json({error: "Habit not found"})
    }

    response.status(200).json(habit)
}

const updateHabit = async (request, response) => {

    const { id } = request.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.statsus(404).json({error: "Habit not found"})
    }

    const habit = await Habit.findOneAndUpdate({_id: id}, {
        ...request.body
    })
    if (!habit) {
        return response.status(404).json({error: "Habit not found"})
    }

    response.status(200).json(habit)
}

module.exports = {
    createHabit,
    getHabit, getHabits,
    deleteHabit,
    updateHabit
}
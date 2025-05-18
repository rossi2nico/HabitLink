const express = require('express')
const Habit = require('../models/habitModel')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth');


// Import habit controller functions
const {
    getHabit, getHabits, 
    createHabit, 
    deleteHabit, 
    updateHabit,
    syncHabit
} = require('../controllers/habitController')

// Route Handlers: handle requests with habitController
router.use(requireAuth)

router.get('/', getHabits)
router.get('/:id', getHabit)
router.post('/', createHabit)
router.post('/sync', syncHabit)
router.delete('/:id', deleteHabit)
router.patch("/:id", updateHabit)

module.exports = router; // Export habits router to be used in server.js
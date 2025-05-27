const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth');


// Import habit controller functions
const {
    getHabit, getHabits, 
    createHabit, 
    deleteHabit, 
    updateHabit,
    syncHabit,
    getPublicHabits,
    getTargetHabits
} = require('../controllers/habitController')

// Route Handlers: handle requests with habitController

router.use(requireAuth)
router.get('/', getHabits)
router.get('/public', getPublicHabits)
router.get('/public/:targetUserId', getTargetHabits)
router.get('/:id', getHabit)
router.post('/', createHabit)
router.post('/sync', syncHabit)
router.delete('/:id', deleteHabit)
router.patch("/:id", updateHabit)

module.exports = router; // Export habits router to be used in server.js
const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth');

const {
    getHabit, getHabits, 
    createHabit, 
    deleteHabit, 
    updateHabit,
    syncHabit,
    getPublicHabits,
    getTargetHabits,
    getFriendHabits,
    toggleComplete
} = require('../controllers/habitController')

// Route Handlers: handle requests with habitController

router.use(requireAuth)
router.get('/', getHabits)
router.get('/public', getPublicHabits)
router.get('/friends', getFriendHabits);
router.get('/public/:targetUserId', getTargetHabits)
router.get('/:habitId', getHabit)
router.post('/', createHabit)
router.post('/sync', syncHabit)
router.post('/complete', toggleComplete)
router.delete('/:id', deleteHabit)
router.patch('/:habitId', updateHabit)

module.exports = router; // Export habits router to be used in server.js
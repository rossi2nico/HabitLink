const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

const { getHabit, syncHabit, createHabit, toggleComplete, deleteHabit, getHabits, getLinkedHabits, getFriendHabits} = require('../controllers/habitController');

// Route Handlers: handle requests with newHabitController

router.use(requireAuth);

router.get('/', getHabits); //         const { currentDate } = req.query
router.get('/friends', getFriendHabits);
router.get('/linkedHabits/:habitId', getLinkedHabits);
router.get('/:habitId', getHabit); //         const { currentDate } = req.query

router.post('/', createHabit);
router.post('/sync', syncHabit);
router.post('/complete/:habitId', toggleComplete);

router.delete('/:habitId', deleteHabit);

module.exports = router; // Export habits router to be used in server.js
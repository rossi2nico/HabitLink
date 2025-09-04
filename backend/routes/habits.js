
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

const {
  getHabit,
  getHabits,
  createHabit,
  deleteHabit,
  updateHabit,
  syncHabit,
  getPublicHabits,
  getTargetHabits,
  getFriendHabits,
  getSyncedHabits,
  toggleComplete,
} = require('../controllers/habitController');

const { createHabit2, toggleComplete2 } = require('../controllers/newHabitController')

// Route Handlers: handle requests with habitController

router.use(requireAuth);
router.post('/gmi', createHabit2);

router.get('/', getHabits);
router.get('/public', getPublicHabits);
router.get('/friends', getFriendHabits);
router.get('/public/:targetUserId', getTargetHabits);
router.get('/:habitId', getHabit);
router.get('/syncedHabits/:habitId', getSyncedHabits);

router.post('/', createHabit);
router.post('/sync', syncHabit);
router.post('/complete', toggleComplete);

router.delete('/:habitId', deleteHabit);
router.patch('/:habitId', updateHabit);

module.exports = router; // Export habits router to be used in server.js
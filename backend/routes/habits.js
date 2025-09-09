
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

const { getHabit: getHabit2, syncHabit: syncHabit2, createHabit: createHabit2, toggleComplete: toggleComplete2, deleteHabit: deleteHabit2, getHabits: getHabits2, getLinkedHabits } = require('../controllers/newHabitController')

// Route Handlers: handle requests with habitController

router.use(requireAuth);
router.post('/2/', createHabit2);
router.delete('/2/:habitId', deleteHabit2);
router.post('/2/complete/:habitId', toggleComplete2)
router.get('/2/:habitId', getHabit2) //         const { currentDate } = req.query
router.get('/2/', getHabits2) //         const { currentDate } = req.query
router.post('/2/sync', syncHabit2);
router.get('/2/linkedHabits/:habitId', getLinkedHabits);


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
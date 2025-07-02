const express = require("express")
const router = express.Router()
const requireAuth = require('../middleware/requireAuth');

const { getFriends, getPendingUsers, signupUser, loginUser, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend, getUsers } = require('../controllers/userController')

router.get('/', getUsers)
router.post('/login', loginUser)
router.post('/signup', signupUser)

router.use(requireAuth);
router.post('/send-friend-request', sendFriendRequest)
router.post('/accept-friend-request', acceptFriendRequest)
router.post('/decline-friend-request', declineFriendRequest)
router.post('/remove-friend', removeFriend)

router.get('/:userId/friends', getFriends)
router.get('/:userId/pending-users', getPendingUsers)

module.exports = router
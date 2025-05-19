const express = require("express")
const router = express.Router()
const requireAuth = require('../middleware/requireAuth');


const { signupUser, loginUser, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend } = require('../controllers/userController')

router.post('/login', loginUser)
router.post('/signup', signupUser)

router.use(requireAuth);
router.post('/send-friend-request', sendFriendRequest)
router.post('/accept-friend-request', acceptFriendRequest)
router.post('/decline-friend-request', declineFriendRequest)
router.post('/remove-friend', removeFriend)

module.exports = router
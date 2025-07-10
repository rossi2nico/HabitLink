const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '30d'})
}

const searchUsers = async (req, res) => {
    const searchTerm = req.query.q; // api/users/search?q=nico

    try {
        const regex = new RegExp(searchTerm, 'i');

        const users = await User.find({
            $or : [
                { username: regex }
            ]
        }).limit(10);

        res.status(200).json(users);
    } catch (error) {
        res.status(400).json( {error: error.message });
    }
}

const getFriends = async (req, res) => { 
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).populate('friends', 'username _id');
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getPendingUsers = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).populate('pendingUsers', 'username _id');
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json(user.pendingUsers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1})
    res.status(200).json(users);
}

const loginUser = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
   
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.status(200).json({_id: user._id, username, token})
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
        
}

const signupUser = async (req, res) => {
    const username = req.body.username.toLowerCase();
    if (username.length > 12) {
        return res.status(400).json({ error: 'username must be 12 or less characters'})
    }
    const password = req.body.password;

    try {
        const user = await User.signup(username, password)
        // create a token
        const token = createToken(user._id)
        res.status(200).json({_id: user._id, username, token})
    } 
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

const sendFriendRequest = async (req, res) => {
    const { targetUserId } = req.body;
    const userId = req.user._id;

    try {
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({error: 'User does not exist'})
        }
        const user = await User.findById(userId)
        
        if (userId.toString() == targetUserId.toString()) {
            return res.status(400).json({ error: 'Can not send friend request to yourself'})
        }
        const alreadyRequested = targetUser.pendingUsers.some(
            (pendingUser) => pendingUser.toString() === userId.toString()
        )
        if (alreadyRequested) {
            return res.status(409).json({error: 'Request has already been sent!'})
        }
        const usersAlreadyFriends = user.friends.some(
            pendingUser => pendingUser.toString() === targetUserId.toString()
        )
        if (usersAlreadyFriends) {
            return res.status(409).json({error: 'Users are already friends'})
        }
        const targetUserPending = user.pendingUsers.some(
            (pendingUser) => pendingUser.toString() === targetUserId.toString()
        )
        if (targetUserPending) {
            user.pendingUsers = user.pendingUsers.filter(
                (pendingUser) => pendingUser.toString() !== targetUserId.toString()
            )
            user.friends.push(targetUserId);
            targetUser.friends.push(userId);

            await user.save();
            await targetUser.save();

            return res.status(200).json({ status: 'friend_added', targetUser: targetUser })
        }
        targetUser.pendingUsers.push(userId);
        await targetUser.save();
        
        res.status(200).json({ status: 'request_sent', targetUser: targetUser})
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

const acceptFriendRequest = async (req, res) => {
    const { incomingUserId } = req.body;
    const userId = req.user._id;
  
    try {
      const user = await User.findById(userId);
      const incomingUser = await User.findById(incomingUserId);
  
      if (!user || !incomingUser) {
        return res.status(409).json({ error: 'User not found' });
      }
  
      const isPending = user.pendingUsers.some(
        (pendingUser) => pendingUser.toString() === incomingUserId.toString()
      );
      
      if (!isPending) {
        return res.status(400).json({ error: 'User is not in pending list.' });
      }

      user.pendingUsers = user.pendingUsers.filter(
        (pendingUser) => pendingUser.toString() !== incomingUserId.toString()
      );
  
      user.friends.push(incomingUserId);
      incomingUser.friends.push(userId);
  
      await user.save();
      await incomingUser.save();
  
      res.status(200).json(incomingUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

const declineFriendRequest = async (req, res) => {
    const { incomingUserId } = req.body
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        user.pendingUsers = user.pendingUsers.filter(
            (pendingUser) => pendingUser.toString() !== incomingUserId.toString()
        )
        await user.save();
        res.status(200).json(incomingUserId);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const removeFriend = async (req, res) => {
    const { targetUserId } = req.body
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId)
        if (!user || !targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const isFriends = user.friends.some(
            friendId => friendId.toString() === targetUserId.toString()
        )

        if (!isFriends) {
            return res.status(400).json({error: 'User is not on friend list'})
        }

        user.friends = user.friends.filter(
            friendId => friendId.toString() !== targetUserId.toString()
        )
        targetUser.friends = targetUser.friends.filter(
            friendId => friendId.toString() !== userId.toString()
        )

        await targetUser.save();
        await user.save();
        res.status(200).json(targetUser)

    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = { searchUsers, getFriends, getPendingUsers, signupUser, loginUser, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend, getUsers }
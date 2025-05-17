const User = require('../models/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '30d'})
}

//login
const loginUser = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
   
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.status(200).json({username, token})
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
        
}
//sign up
const signupUser = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    try {
        const user = await User.signup(username, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({username, token})
    } 
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = { signupUser, loginUser}
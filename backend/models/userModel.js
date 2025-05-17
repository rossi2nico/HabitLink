const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pendingUsers: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }]
})



//static login method
userSchema.statics.login = async function(rawUsername, password) {
    if (!rawUsername || !password) {
        throw Error('All fields must be filled')
    }

    const username = rawUsername.trim().toLowerCase();
    const user = await this.findOne({username})

    if (!user) {
        throw Error('Incorrect Username')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect Password!')
    }
    return user;
}
//model comes with its own methods, and we can make our own!
// static signup method
userSchema.statics.signup = async function (rawUsername, password) {

    //validation
    if (!rawUsername || !password) {
        throw Error('All fields must be filled')
    }
    
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    const username = rawUsername.trim().toLowerCase();
    const exists = await this.findOne({username})

    if (exists) {
        throw Error('Username already in use')
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        throw Error('Username must contain only letters and numbers');
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ username, password: hash }) // creates document

    return user
}

module.exports = mongoose.model('User', userSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
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
}, { timestamps: true});

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

userSchema.statics.signup = async function (rawUsername, password) {

    if (!rawUsername || !password) {
        throw Error('All fields must be filled')
    }
    
    if (!validator.isStrongPassword(password)) {
        throw Error('Password must include a special character, an uppercase letter, and 8 characters.')
    }

    const username = rawUsername.trim().toLowerCase();
    const exists = await this.findOne({username})

    if (exists) {
        throw Error('Username already in use')
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        throw Error('Username must contain only letters and numbers');
    }

    // create user with username and encrypted password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ username, password: hash }) // creates document

    return user
}

module.exports = mongoose.model('User', userSchema)
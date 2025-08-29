require('dotenv').config() // Includes the .env file. This is where port is located
const express = require('express')
const mongoose = require('mongoose')
const habitRoutes = require('./routes/habits')
const userRoutes = require('./routes/user')
const cors = require('cors');

const app = express() // Express: handles requests and interacts with database.

app.use(cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200 // This is key for preflight
}));
// Explicitly handle all OPTIONS requests
// app.options('*', cors());

app.use(express.json())

app.use('/api/habits', habitRoutes)
app.use('/api/users', userRoutes)

// Connect to the database
mongoose.connect(process.env.MONGODB_URI)
    // Successfully connected to the database
    .then(() => {
        //Listen for requests on PORT
        app.listen(process.env.PORT, () => {
            console.log("Connected to database" )
        })
    })
    // Could not connect to database
    .catch((error) => {
        console.log(error)
    })


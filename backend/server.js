require('dotenv').config() // Includes the .env file. This is where port is located
const express = require('express')
const mongoose = require('mongoose')
const habitRoutes = require('./routes/habits')
const userRoutes = require('./routes/user')
const app = express() // Express: handles requests and interacts with database.

// Middleware: parse JSON into req.body
app.use(express.json())
// Middleware: logs every incoming HTTP request's path and method 
// app.use((req, res, next) => {
//     console.log(req.path, req.method)
//     next()
// })

// Find these routes when we come to a specific path
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


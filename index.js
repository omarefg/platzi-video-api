const express = require('express')
const app = express()
const { config } = require('./config')
const moviesApi = require('./routes/movies')

const { logErrors, errorHandler, wrapError, notFoundHandler } = require('./utils/middlewares/error-handlers') 

// Body Parser
app.use(express.json())

// Routes
moviesApi(app)

// Catch 404
app.use(notFoundHandler)

// Errors Middlewares
app.use(logErrors)
app.use(wrapError)
app.use(errorHandler)

app.listen(config.port, function () {
    console.log(`Listening http://localhost:${config.port}`)
})
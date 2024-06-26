const express = require('express')
const morgan = require('morgan')

require('dotenv').config()
const app = express()

app.use(morgan('dev'))
app.use(require('cors')())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const fileserverRouter = require('../api/file-server')

app.use('/file-server', fileserverRouter)

app.use((req, res, next) => {
    res.status(404).json('404 Not Found')
})

module.exports = app
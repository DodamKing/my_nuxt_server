const express = require('express')
const morgan = require('morgan')

require('dotenv').config()
const app = express()

if (process.env.NODE_ENV === 'development') {
    app.enable('trust proxy')
}

app.use(morgan('dev'))
app.use(require('cors')())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const fileserverRouter = require('../api/file-server')

app.use('/file-server', fileserverRouter)

module.exports = app
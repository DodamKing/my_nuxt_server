const express = require('express')
const app = express()

app.use(require('cors')())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const fileserverRouter = require('../api/file-server')

app.use('/file-server', fileserverRouter)

module.exports = app
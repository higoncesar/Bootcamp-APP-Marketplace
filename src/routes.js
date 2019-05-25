const express = require('express')

const routes = express.Router()

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionControlle')

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

module.exports = routes

const express = require('express')
const router = new express.Router()
const errorController = require('../controllers/errorController')
const utilities = require('../utilities/')

router.get('/test500', utilities.handleErrors(errorController.test500))

module.exports = router

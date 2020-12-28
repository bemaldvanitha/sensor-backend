const express = require('express')
const router = express.Router()
const sensor = require('../models/sensor')
const {getData , getTempAlerts} = require('../controllers/tempDataController')


router.get('/data', getData)
router.get('/alerts', getTempAlerts)


module.exports = router
const mongoose = require('mongoose')

const sensorSchema = mongoose.Schema({
    sensor_id: String,
    date: String,
    data_value: String
})

const sensor = mongoose.model('sensor', sensorSchema)

module.exports = sensor
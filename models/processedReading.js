const mongoose = require('mongoose');

const processedReadingSchema = new mongoose.Schema({
    sensor_reading_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sensor'
    },
    sensor_id: {
        type: String,
        required: true
    },
    reading_type: String,
    data_value: String,
    date: Date,
    alert:{
        alertStatus:{
            type: Boolean,
            default: false
        },
        alertText: String
    }
})

const processedReading = mongoose.model('processedReading',processedReadingSchema);

module.exports = processedReading;
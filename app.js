const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const env = require('dotenv')
const processedReading = require('./models/processedReading')
const TemperatureLimit = require('./operations/checkTemperatureLimit')
const convertToDateObject = require('./operations/convertToDateObject')
const { Result } = require('express-validator')
env.config()
const app = express()

const DATABASE_URL = "mongodb+srv://new-user:software123@cluster0.pnwp2.mongodb.net/sensors?retryWrites=true&w=majority"

app.use(bodyParser.json({ extended: true }))

app.use(cors())

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})

const db = mongoose.connection

const sensorCollection = db.collection('sensors')


db.on('error', error => console.error(error))

db.once('open', () => {
    console.log('conneted to monogdb')

    const changeStream = sensorCollection.watch();

    changeStream.on('change', (change) => {
        
        if (change.operationType === 'insert') {
            const data = change.fullDocument

            const newProcessedReading = new processedReading({
                sensor_reading_id: data._id,
                sensor_id: data.sensor_id,
                reading_type: 'temperature',
                data_value: data.data_value,
                date: convertToDateObject(data.date)
            })
            
            if (TemperatureLimit.checkValue(data.data_value)) {
                newProcessedReading.alert = {
                        alertStatus: true,
                        alertText: "Temperature is greater than threshold value"
                }
            }
            
            newProcessedReading
                    .save()
                    .then(result => {
                        console.log(result)
                    })
                    .catch(err => {
                        res.status(404).json({
                            error: 'Error is occure'
                        });
                        console.log(err)
                    })
             
            
            console.log("\n", data)
        }
        
    })
})

app.use('/temperature', require('./routes/tempRouter'))
app.use('/signin',require('./routes/auth'))
app.use('/signup',require('./routes/users'))

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status(404)
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

const PORT = 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
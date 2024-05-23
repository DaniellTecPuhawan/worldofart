require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
//const app = express() //express app
const wofDataRoutes = require('./routes/wofDataRoute') //Routes

//express app

const app = express ()

//middleware

app.use(express.json())
app.use((req,res, next) => {
    console.log(req.path, req.method)
    next()
})

//msg
app.get('/', (req, res) => {
    res.json({mssg:'Server ON'})
})

//routes
app.use('/wofData', wofDataRoutes)

//connect db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //requests
        app.listen(process.env.PORT, () => {
            console.log('Listen port:', 'http://localhost:' + process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

//requests
//app.listen(process.env.PORT, () => {
  //  console.log('Listen port:', process.env.PORT)
//})


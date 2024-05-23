const mongoose = require('mongoose')

const Schema = mongoose.Schema

const wofDataSchema = new Schema({

    name:{
        type:String,
        required: true
    },title:{
        type:String,
        required: true
    },story:{
        type:String,
        required: true
    },type:{
        type:String,
        required: true
    },
    range:{
        type:String,
        required: true
    },
    movementSpeed:{
        type:String,
        required: true
    },
    Enchantment:{
        type:String,
        required: true
    },
})

module.exports = mongoose.model('wofData', wofDataSchema)
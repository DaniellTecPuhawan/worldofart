const mongoose = require('mongoose')
const WofData = require('../models/wofDataModel')

//GET all data
const getWofDatas = async (req, res) => {
    const wofDatas = await WofData.find({}).sort({createAt: -1})
    res.status(200).json(wofDatas)
}

//GET a single data
const getWofData = async (req, res) => {
    const { id } = req.params
    const wofData = await WofData.findById(id)

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No data'})
    }

    if(!wofData){
        return res.status(400).json({error:"No data"})
    }
    res.status(200).json(wofData)
}

//create a new workout
const createWofData = async (req, res) => {
    const {name, title, story, type, range, movementSpeed, Enchantment} = req.body
    //doc to db

    try{
        const wofData = await WofData.create({name, title, story, type, range, movementSpeed, Enchantment})
        res.status(200).json(wofData)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

const updateWofData = async (req,res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No data'})
    }
    const wofData = await WofData.findOneAndUpdate({_id: id},{
        ...req.body
    })

    if(!wofData){
        return res.status(400).json({error:"No data"})
    }
    res.status(200).json(wofData)
}

const deleteWofData = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No data'})
    }
    const wofData = await WofData.findOneAndDelete({_id: id})

    if(!wofData){
        return res.status(400).json({error:"No data"})
    }
    res.status(200).json(wofData)
}

module.exports = {
    getWofDatas,
    getWofData,
    createWofData,
    updateWofData,
    deleteWofData
}
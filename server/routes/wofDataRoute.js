const express = require('express')
const router = express.Router()
//const WofData = require('../models/wofDataModel')
const {getWofData , getWofDatas, createWofData, updateWofData, deleteWofData } = require('../controller/wofDataController') 

//GET all data
router.get('/', getWofDatas)

//router.get('/', (req, res) => {
    //res.json({mssg: 'Get all data'})
//})

//GET a single data
router.get('/:id', getWofData)

//router.get('/:id', (req, res) =>{
  //  res.json({mssg:'GET a single data'})
//})

//POST a single data

router.post('/', createWofData)

//router.post('/', async (req, res) =>{
   // const {name, title, story, type, range, movementSpeed, Enchantment} = req.body

   // try {
    //    const wofData = await WofData.create({name, title, story, type, range, movementSpeed, Enchantment})
        //res.status(200).json(WofData)
   // }catch (error) {
   //     res.status(400).json({error: error.message})
   // }
    //res.json({mssg: 'Post a new data'})
//})

//UPDATE a single data
router.patch('/:id', updateWofData)
//router.patch('/:id', (req, res) =>{
  //  res.json({mssg:'UPDATE a single data'})
//})

//DELETE a single data
router.delete('/:id', deleteWofData)
//router.delete('/:id', (req, res) =>{
  //  res.json({mssg:'DELETE a single data'})
//})

module.exports = router
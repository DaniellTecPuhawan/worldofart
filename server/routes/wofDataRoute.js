const express = require('express');
const router = express.Router();
const ImageController = require('./ImageController');
const multer = require('multer');
const path = require('path');
const wofDataController = require('../controller/wofDataController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  const upload = multer({ storage });
  
  // Ruta para subir una imagen
  router.post('/upload', upload.single('image'), ImageController.uploadImage);
  
  // Ruta para obtener todas las imágenes
  router.get('/images', ImageController.getImages);


router.get('/wofdata', wofDataController.getAllWofDatas);
router.post('/wofdata', wofDataController.createWofData);
router.put('/wofdata/:id', wofDataController.updateWofData);
router.delete('/wofdata/:id', wofDataController.deleteWofData);

module.exports = router;

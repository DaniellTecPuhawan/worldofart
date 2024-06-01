const Image = require('../models/Image');

exports.uploadImage = async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const image = new Image({ name, imageUrl });
    await image.save();

    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
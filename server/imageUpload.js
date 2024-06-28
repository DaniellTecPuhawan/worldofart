// imageUpload.js

const multer = require('multer');
const path = require('path');

// Configurar el almacenamiento con Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directorio donde se guardarán los archivos subidos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo: marca de tiempo + extensión original
    }
});

// Crear la instancia de Multer
const upload = multer({ storage: storage });

module.exports = upload;

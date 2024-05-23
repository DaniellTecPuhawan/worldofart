// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define schema and model (e.g., Item) as explained in the previous response

// Implement CRUD routes (e.g., GET, POST, PUT, DELETE) for your model

// Start the server
app.listen(PORT, () => console.log('Server running on port ${PORT}'));
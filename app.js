const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/database');
const routes = require('./src/routes');

const app = express();
const port = process.env.PORT || 8080;

// Connect to database
connectDB();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Remove trailing slash
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
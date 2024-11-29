
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');

// API routes
router.use('/auth', authRoutes);

module.exports = router;
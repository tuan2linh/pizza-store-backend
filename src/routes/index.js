const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const productRoutes = require('./product.route');

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

module.exports = router;
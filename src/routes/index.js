const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const productRoutes = require('./product.route');
const promotionRoutes = require('./promotion.route');
const cartRoutes = require('./cart.route');
const voucherRoutes = require('./voucher.route');
const orderRoutes = require('./order.route');
const userRoutes = require('./user.route'); // Add this line

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/promotions', promotionRoutes);
router.use('/cart', cartRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/orders', orderRoutes);
router.use('/user', userRoutes); // Add this line

module.exports = router;
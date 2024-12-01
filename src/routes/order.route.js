const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    applyVoucher,
    cancelOrder,
    updateOrderStatus
} = require('../controllers/order.controller');

// Public routes
router.get('/user', auth, getUserOrders);
router.get('/:id', auth, getOrderById);
router.post('/', auth, createOrder);
router.post('/:id/voucher', auth, applyVoucher);
router.put('/:id/cancel', auth, cancelOrder);

// Admin routes
router.get('/', auth, isAdmin, getAllOrders);
router.put('/:id', auth, isAdmin, updateOrder);
router.delete('/:id', auth, isAdmin, deleteOrder);
router.put('/:id/status', auth, isAdmin, updateOrderStatus);

module.exports = router;

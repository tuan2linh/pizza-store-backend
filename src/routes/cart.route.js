const express = require('express');
const router = express.Router();
const { auth, isUser } = require('../middleware/auth');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    applyVoucher
} = require('../controllers/cart.controller');

// All routes require authentication
router.use(auth);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.post('/apply-voucher', auth, applyVoucher);

module.exports = router;
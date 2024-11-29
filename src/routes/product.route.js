const express = require('express');
const router = express.Router();
const { auth, isAdmin, isUser } = require('../middleware/auth');
const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getFilteredProducts
} = require('../controllers/product.controller');

// Public routes
router.get('/', getAllProducts);
router.get('/filter', getFilteredProducts);
router.get('/:id', getProduct);

// Admin only routes
router.post('/', isAdmin, createProduct);
router.put('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router;

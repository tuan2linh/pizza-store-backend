const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
    createVoucher,
    getAllVouchers,
    getVoucherById,
    updateVoucher,
    deleteVoucher,
    validateVoucher,
    checkVoucher
} = require('../controllers/voucher.controller');

// Admin routes
router.post('/', auth, isAdmin, createVoucher);
router.put('/:id', auth, isAdmin, updateVoucher);
router.delete('/:id', auth, isAdmin, deleteVoucher);

// Public routes
router.get('/', auth, getAllVouchers);
router.get('/:id', auth, getVoucherById);
router.post('/validate', auth, validateVoucher);
router.post('/check', auth, checkVoucher);

module.exports = router;
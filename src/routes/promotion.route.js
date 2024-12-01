const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotion.controller');
const { isAdmin } = require('../middleware/auth');  // Change this line

// Public routes
router.get('/', promotionController.getAllPromotions);
router.get('/active', promotionController.getActivePromotions);
router.get('/:id', promotionController.getPromotionById);
router.post('/validate', promotionController.validatePromotion);

// Protected routes (admin only)
router.post('/', isAdmin, promotionController.createPromotion);         // Change authenticate to isAdmin
router.put('/:id', isAdmin, promotionController.updatePromotion);       // Change authenticate to isAdmin
router.delete('/:id', isAdmin, promotionController.deletePromotion);    // Change authenticate to isAdmin
router.patch('/:id/toggle', isAdmin, promotionController.togglePromotionStatus); // Change authenticate to isAdmin

module.exports = router;

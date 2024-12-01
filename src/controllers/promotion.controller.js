const Promotion = require('../models/promotion.model');
const Product = require('../models/product.model');

const promotionController = {
    // Get all promotions
    getAllPromotions: async (req, res) => {
        try {
            const promotions = await Promotion.find()
                .populate('conditions.requiredProducts.productId')
                .populate('conditions.specificProducts')
                .populate('benefits.giftProducts.productId');
            res.json(promotions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get active promotions only
    getActivePromotions: async (req, res) => {
        try {
            const currentDate = new Date();
            const promotions = await Promotion.find({
                active: true,
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate }
            }).populate('conditions.requiredProducts.productId')
              .populate('conditions.specificProducts')
              .populate('benefits.giftProducts.productId');
            res.json(promotions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get promotion by ID
    getPromotionById: async (req, res) => {
        try {
            const promotion = await Promotion.findById(req.params.id)
                .populate('conditions.requiredProducts.productId')
                .populate('conditions.specificProducts')
                .populate('benefits.giftProducts.productId');
            if (!promotion) {
                return res.status(404).json({ message: 'Promotion not found' });
            }
            res.json(promotion);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create new promotion
    createPromotion: async (req, res) => {
        try {
            const promotion = new Promotion(req.body);
            await promotion.save();
            res.status(201).json(promotion);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update promotion
    updatePromotion: async (req, res) => {
        try {
            const promotion = await Promotion.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!promotion) {
                return res.status(404).json({ message: 'Promotion not found' });
            }
            res.json(promotion);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete promotion (soft delete)
    deletePromotion: async (req, res) => {
        try {
            const promotion = await Promotion.findById(req.params.id);
            if (!promotion) {
                return res.status(404).json({ message: 'Promotion not found' });
            }
            await promotion.delete(); // Using mongoose-delete for soft deletion
            res.json({ message: 'Promotion deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Toggle promotion status
    togglePromotionStatus: async (req, res) => {
        try {
            const promotion = await Promotion.findById(req.params.id);
            if (!promotion) {
                return res.status(404).json({ message: 'Promotion not found' });
            }
            promotion.active = !promotion.active;
            await promotion.save();
            res.json(promotion);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Validate promotion for cart
    validatePromotion: async (req, res) => {
        try {
            const { promotionId, cartItems } = req.body;
            const promotion = await Promotion.findById(promotionId)
                .populate('conditions.requiredProducts.productId')
                .populate('conditions.specificProducts');

            if (!promotion) {
                return res.status(404).json({ message: 'Promotion not found' });
            }

            // Check if promotion is active and within date range
            const currentDate = new Date();
            if (!promotion.active || 
                currentDate < promotion.startDate || 
                currentDate > promotion.endDate) {
                return res.status(400).json({ message: 'Promotion is not active' });
            }

            const validationResult = await validatePromotionConditions(promotion, cartItems);
            if (!validationResult.isValid) {
                return res.status(400).json({ 
                    message: 'Promotion conditions not met',
                    details: validationResult.reason 
                });
            }

            // Calculate benefits
            const benefits = calculatePromotionBenefits(promotion, cartItems);
            res.json({ 
                isValid: true,
                benefits: benefits
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

// Helper function to validate promotion conditions
const validatePromotionConditions = async (promotion, cartItems) => {
    try {
        switch (promotion.type) {
            case 'GIFT_PRODUCT':
                return validateGiftProductConditions(promotion, cartItems);
            case 'DISCOUNT_NEXT_PRODUCT':
                return validateDiscountNextProductConditions(promotion, cartItems);
            case 'FIXED_PRICE':
                return validateFixedPriceConditions(promotion, cartItems);
            case 'DATE_BASED_DISCOUNT':
                return validateDateBasedConditions(promotion, cartItems);
            case 'COMBO':
                return validateComboConditions(promotion, cartItems);
            default:
                return { isValid: false, reason: 'Invalid promotion type' };
        }
    } catch (error) {
        return { isValid: false, reason: error.message };
    }
};

// Validation helper functions
const validateGiftProductConditions = (promotion, cartItems) => {
    const { requiredProducts } = promotion.conditions;
    
    // Check if cart has required products
    for (const required of requiredProducts) {
        const cartItem = cartItems.find(item => 
            item.productId.toString() === required.productId.toString() &&
            (!required.size || item.size === required.size)
        );

        if (!cartItem || cartItem.quantity < required.quantity) {
            return {
                isValid: false,
                reason: `Need ${required.quantity} x ${required.productId.name} ${required.size || ''}`
            };
        }
    }

    return { isValid: true };
};

const validateDiscountNextProductConditions = (promotion, cartItems) => {
    const { requiredProducts } = promotion.conditions;
    
    // Check if cart has at least one more item than required
    if (cartItems.length <= requiredProducts.length) {
        return {
            isValid: false,
            reason: 'Need additional item for discount'
        };
    }

    // Validate required products
    for (const required of requiredProducts) {
        const cartItem = cartItems.find(item => 
            item.productId.toString() === required.productId.toString()
        );

        if (!cartItem || cartItem.quantity < required.quantity) {
            return {
                isValid: false,
                reason: `Need ${required.quantity} x ${required.productId.name}`
            };
        }
    }

    return { isValid: true };
};

const validateFixedPriceConditions = (promotion, cartItems) => {
    const { minQuantity, specificProducts } = promotion.conditions;
    
    // Filter cart items that match specific products
    const validItems = cartItems.filter(item => 
        specificProducts.some(p => p.toString() === item.productId.toString())
    );

    const totalQuantity = validItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity < minQuantity) {
        return {
            isValid: false,
            reason: `Need at least ${minQuantity} qualifying items`
        };
    }

    return { isValid: true };
};

const validateDateBasedConditions = (promotion, cartItems) => {
    const { specificDates, specificCategories, minQuantity } = promotion.conditions;
    const currentDate = new Date();
    
    // Check if current date matches specific dates
    if (!specificDates.includes(currentDate.getDate())) {
        return {
            isValid: false,
            reason: 'Promotion not valid on this date'
        };
    }

    // Filter items by category
    const validItems = cartItems.filter(item => 
        item.productId.subCategory.some(cat => specificCategories.includes(cat))
    );

    const totalQuantity = validItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity < minQuantity) {
        return {
            isValid: false,
            reason: `Need at least ${minQuantity} qualifying items`
        };
    }

    return { isValid: true };
};

const validateComboConditions = (promotion, cartItems) => {
    const { requiredProducts } = promotion.conditions;

    for (const required of requiredProducts) {
        const cartItem = cartItems.find(item => 
            item.productId.toString() === required.productId.toString() &&
            (!required.size || item.size === required.size)
        );

        if (!cartItem || cartItem.quantity < required.quantity) {
            return {
                isValid: false,
                reason: `Need ${required.quantity} x ${required.productId.name} ${required.size || ''}`
            };
        }
    }

    return { isValid: true };
};

// Helper function to calculate promotion benefits
const calculatePromotionBenefits = (promotion, cartItems) => {
    switch (promotion.type) {
        case 'GIFT_PRODUCT':
            return calculateGiftProductBenefits(promotion);
        case 'DISCOUNT_NEXT_PRODUCT':
            return calculateDiscountNextProductBenefits(promotion, cartItems);
        case 'FIXED_PRICE':
            return calculateFixedPriceBenefits(promotion);
        case 'DATE_BASED_DISCOUNT':
            return calculateDateBasedDiscountBenefits(promotion, cartItems);
        case 'COMBO':
            return calculateComboBenefits(promotion);
        default:
            return null;
    }
};

// Benefit calculation functions
const calculateGiftProductBenefits = (promotion) => {
    return {
        type: 'GIFT_PRODUCT',
        giftProducts: promotion.benefits.giftProducts.map(product => ({
            productId: product.productId,
            quantity: product.quantity,
            size: product.size
        }))
    };
};

const calculateDiscountNextProductBenefits = (promotion, cartItems) => {
    const { discountPercentage } = promotion.benefits;
    const discountedItem = cartItems[cartItems.length - 1];
    const originalPrice = discountedItem.price;
    const discountAmount = (originalPrice * discountPercentage) / 100;

    return {
        type: 'DISCOUNT_NEXT_PRODUCT',
        discountPercentage,
        discountAmount,
        appliedToProduct: discountedItem.productId
    };
};

const calculateFixedPriceBenefits = (promotion) => {
    return {
        type: 'FIXED_PRICE',
        fixedPrice: promotion.benefits.fixedPrice
    };
};

const calculateDateBasedDiscountBenefits = (promotion, cartItems) => {
    const { discountPercentage } = promotion.benefits;
    const { specificCategories } = promotion.conditions;

    const eligibleItems = cartItems.filter(item => 
        item.productId.subCategory.some(cat => specificCategories.includes(cat))
    );

    const totalDiscount = eligibleItems.reduce((sum, item) => 
        sum + (item.price * discountPercentage / 100), 0
    );

    return {
        type: 'DATE_BASED_DISCOUNT',
        discountPercentage,
        totalDiscount,
        appliedToProducts: eligibleItems.map(item => item.productId)
    };
};

const calculateComboBenefits = (promotion) => {
    return {
        type: 'COMBO',
        comboPrice: promotion.benefits.comboPrice,
        savings: calculateComboSavings(promotion)
    };
};

// Helper function to calculate combo savings
const calculateComboSavings = (promotion) => {
    const regularTotal = promotion.conditions.requiredProducts.reduce(
        (sum, item) => sum + (item.productId.price[item.size || 'medium'] * item.quantity), 
        0
    );
    return regularTotal - promotion.benefits.comboPrice;
};

module.exports = promotionController;

const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Promotion name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Promotion description is required'],
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['GIFT_PRODUCT', 'DISCOUNT_NEXT_PRODUCT', 'FIXED_PRICE', 'DATE_BASED_DISCOUNT', 'COMBO']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    conditions: {
        requiredProducts: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            size: {
                type: String,
                enum: ['small', 'medium', 'large']
            }
        }],
        minQuantity: Number,
        specificDates: [Number], // For date-based promotions (e.g., [1, 15] for 1st and 15th)
        specificCategories: [String], // For category-specific promotions
        specificProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }]
    },
    benefits: {
        giftProducts: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            size: {
                type: String,
                enum: ['small', 'medium', 'large']
            }
        }],
        discountPercentage: Number,
        fixedPrice: {
            price: Number,
            size: {
                type: String,
                enum: ['small', 'medium', 'large']
            }
        },
        comboPrice: Number
    },
    maxUsagePerUser: {
        type: Number,
        default: null
    },
    totalUsageLimit: {
        type: Number,
        default: null
    },
    currentUsage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add indexes for frequently queried fields
promotionSchema.index({ type: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });
promotionSchema.index({ active: 1 });

// Add mongoose-delete plugin for soft deletion
promotionSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;

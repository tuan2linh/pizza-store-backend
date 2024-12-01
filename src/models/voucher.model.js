
const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const voucherSchema = new mongoose.Schema({
    voucher_code: {
        type: String,
        required: [true, 'Voucher code is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    voucher_type: {
        type: String,
        required: [true, 'Voucher type is required'],
        enum: ['percentage', 'fixed_amount', 'free_shipping']
    },
    discount_value: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount value cannot be negative']
    },
    max_discount: {
        type: Number,
        min: [0, 'Maximum discount cannot be negative']
    },
    min_order_value: {
        type: Number,
        required: [true, 'Minimum order value is required'],
        min: [0, 'Minimum order value cannot be negative']
    },
    applicable_to: {
        type: String,
        required: [true, 'Applicable to field is required'],
        enum: ['all', 'specific_products', 'specific_categories']
    },
    product_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    category_ids: [{
        type: String
    }],
    start_date: {
        type: Date,
        required: [true, 'Start date is required']
    },
    end_date: {
        type: Date,
        required: [true, 'End date is required']
    },
    usage_limit: {
        type: Number,
        required: [true, 'Usage limit is required'],
        min: [1, 'Usage limit must be at least 1']
    },
    per_user_limit: {
        type: Number,
        required: [true, 'Per user limit is required'],
        min: [1, 'Per user limit must be at least 1']
    },
    usage_count: {
        type: Number,
        default: 0,
        min: [0, 'Usage count cannot be negative']
    },
    is_unique: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Validation middleware
voucherSchema.pre('validate', function(next) {
    if (this.end_date <= this.start_date) {
        next(new Error('End date must be after start date'));
        return;
    }

    if (this.voucher_type === 'percentage' && this.discount_value > 100) {
        next(new Error('Percentage discount cannot exceed 100%'));
        return;
    }

    if (this.applicable_to === 'specific_products' && (!this.product_ids || this.product_ids.length === 0)) {
        next(new Error('Product IDs are required for specific products voucher'));
        return;
    }

    if (this.applicable_to === 'specific_categories' && (!this.category_ids || this.category_ids.length === 0)) {
        next(new Error('Category IDs are required for specific categories voucher'));
        return;
    }

    next();
});

// Indexes
voucherSchema.index({ voucher_code: 1 });
voucherSchema.index({ start_date: 1, end_date: 1 });
voucherSchema.index({ status: 1 });
voucherSchema.index({ is_unique: 1 });

// Add mongoose-delete plugin
voucherSchema.plugin(mongoose_delete, { 
    deletedAt: true,
    overrideMethods: true 
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
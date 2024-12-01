const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        },
        size: {
            type: String,
            required: true,
            enum: ['small', 'medium', 'large']
        },
        price: {
            type: Number,
            required: true
        },
        subTotal: {
            type: Number,
            required: true
        }
    }],
    customerInfo: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: String,
        address: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            district: String,
            ward: String,
            notes: String
        }
    },
    paymentDetails: {
        method: {
            type: String,
            required: true,
            enum: ['cash', 'credit_card', 'e_wallet', 'bank_transfer']
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        transactionId: String,
        paidAt: Date
    },
    appliedPromotions: [{
        promotionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Promotion'
        },
        name: String,
        discountAmount: Number
    }],
    appliedVouchers: [{
        voucherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Voucher'
        },
        code: String,
        discountAmount: Number
    }],
    orderSummary: {
        subtotal: {
            type: Number,
            required: true
        },
        deliveryFee: {
            type: Number,
            required: true,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        }
    },
    deliveryInfo: {
        type: {
            type: String,
            required: true,
            enum: ['delivery', 'pickup']
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'preparing', 'ready_for_delivery', 'out_for_delivery', 'delivered'],
            default: 'pending'
        },
        estimatedDeliveryTime: Date,
        actualDeliveryTime: Date,
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver'
        },
        trackingNotes: [{
            status: String,
            timestamp: Date,
            note: String
        }]
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled', 'refunded'],
        default: 'pending'
    },
    specialInstructions: String,
    cancelReason: String,
    refundInfo: {
        amount: Number,
        reason: String,
        processedAt: Date,
        transactionId: String
    }
}, {
    timestamps: true
});

// Indexes for frequently queried fields
orderSchema.index({ userId: 1 });
orderSchema.index({ 'customerInfo.phone': 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'paymentDetails.status': 1 });
orderSchema.index({ 'deliveryInfo.status': 1 });

// Add mongoose-delete plugin for soft deletion
orderSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity cannot be less than 1']
        },
        size: {
            type: String,
            required: true,
            enum: ['small', 'medium', 'large']
        },
        price: {
            type: Number,
            required: true, 
            min: [0, 'Price cannot be negative']
        },
        subTotal: {
            type: Number,
            required: true,
            min: [0, 'Subtotal cannot be negative']
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Total amount cannot be negative']
    }
}, {
    timestamps: true
});

// Create indexes for frequent queries
cartSchema.index({ userId: 1 });

// Add mongoose-delete plugin for soft deletion
cartSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
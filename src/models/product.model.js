const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        small: {
            type: Number,
            min: [0, 'Price cannot be negative']
        },
        medium: {
            type: Number,
            min: [0, 'Price cannot be negative']
        },
        large: {
            type: Number,
            min: [0, 'Price cannot be negative']
        }
    },
    promotionPrice: {
        small: {
            type: Number,
            min: [0, 'Promotion price cannot be negative'],
            default: 0
        },
        medium: {
            type: Number,
            min: [0, 'Promotion price cannot be negative'],
            default: 0
        },
        large: {
            type: Number,
            min: [0, 'Promotion price cannot be negative'],
            default: 0
        }
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    mainCategories: [{
        type: String,
        required: [true, 'At least one main category is required'],
        trim: true
    }],
    subCategory: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Update the validation middleware
productSchema.pre('validate', function(next) {
    if (!this.price) {
        next(new Error('Price object is required'));
        return;
    }
    
    const hasValidPrice = Object.values(this.price).some(price => 
        typeof price === 'number' && price > 0
    );

    if (!hasValidPrice) {
        next(new Error('At least one size price is required and must be greater than 0'));
        return;
    }
    
    next();
});

// Create indexes for frequently queried fields
productSchema.index({ name: 1 });
productSchema.index({ mainCategories: 1 });
productSchema.index({ subCategory: 1 });

// Add mongoose-delete plugin for soft deletion
productSchema.plugin(mongoose_delete, { 
    deletedAt: true,
    overrideMethods: true 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
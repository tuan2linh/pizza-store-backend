const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoose_delete = require('mongoose-delete');

const addressRegex = /^[^,]+, [^,]+, [^,]+, [^,]+$/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    refreshToken: {
        type: String,
        default: null
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters'],
        maxlength: [50, 'Full name cannot exceed 50 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10,15}$/, 'Please enter a valid phone number']
    },
    addresses: [{
        address: {
            type: String
        },
        recipientName: {
            type: String,
            required: [true, 'Recipient name is required']
        },
        recipientEmail: {
            type: String,
            required: [true, 'Recipient email is required'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        recipientPhone: {
            type: String,
            required: [true, 'Recipient phone number is required'],
            match: [/^\d{10,15}$/, 'Please enter a valid phone number']
        }
    }]
}, {
    timestamps: true
});

// Create indexes for frequently queried fields
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Add method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Add mongoose-delete plugin
userSchema.plugin(mongoose_delete, { 
    deletedAt: true,
    overrideMethods: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
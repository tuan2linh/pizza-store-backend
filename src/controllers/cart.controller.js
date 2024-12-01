const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Voucher = require('../models/voucher.model');

const cartController = {
    // Get cart for current user
    getCart: async (req, res) => {
        try {
            let cart = await Cart.findOne({ userId: req.user.userId })
                .populate('items.productId');
            if (!cart) {
                cart = await Cart.create({
                    userId: req.user.userId,
                    items: [],
                    totalAmount: 0
                });
            }
            res.status(200).json({
                success: true,
                data: cart
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Add item to cart
    addToCart: async (req, res) => {
        try {
            const { productId, quantity, size } = req.body;

            // Validate product and get price
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            const price = product.price[size];
            const subTotal = price * quantity;

            let cart = await Cart.findOne({ userId: req.user.userId });
            if (!cart) {
                cart = await Cart.create({
                    userId: req.user.userId,
                    items: [],
                    totalAmount: 0
                });
            }

            // Update cart items
            const itemIndex = cart.items.findIndex(item =>
                item.productId.toString() === productId && item.size === size
            );

            if (itemIndex > -1) {
                // Add new quantity to existing quantity
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].subTotal = cart.items[itemIndex].price * cart.items[itemIndex].quantity;
            } else {
                cart.items.push({ productId, quantity, size, price, subTotal });
            }

            // Recalculate total
            cart.totalAmount = cart.items.reduce((total, item) => total + item.subTotal, 0);
            await cart.save();

            res.status(200).json({
                success: true,
                data: cart
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Update cart item
    updateCartItem: async (req, res) => {
        try {
            const { itemId } = req.params;
            const { quantity } = req.body;

            let cart = await Cart.findOne({ userId: req.user.userId });
            if (!cart) {
                cart = await Cart.create({
                    userId: req.user.userId,
                    items: [],
                    totalAmount: 0
                });
            }

            const item = cart.items.id(itemId);
            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found in cart'
                });
            }

            item.quantity = quantity;
            item.subTotal = item.price * quantity;
            cart.totalAmount = cart.items.reduce((total, item) => total + item.subTotal, 0);

            await cart.save();
            res.status(200).json({
                success: true,
                data: cart
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Remove item from cart
    removeFromCart: async (req, res) => {
        try {
            const { itemId } = req.params;
            let cart = await Cart.findOne({ userId: req.user.userId });

            if (!cart) {
                cart = await Cart.create({
                    userId: req.user.userId,
                    items: [],
                    totalAmount: 0
                });
            }

            cart.items = cart.items.filter(item => item._id.toString() !== itemId);
            cart.totalAmount = cart.items.reduce((total, item) => total + item.subTotal, 0);

            await cart.save();
            res.status(200).json({
                success: true,
                data: cart
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    applyVoucher: async (req, res) => {
        try {
            const { voucher_code } = req.body;
            const cart = await Cart.findOne({ userId: req.user.userId });

            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart not found'
                });
            }

            const voucher = await Voucher.findOne({ 
                voucher_code,
                status: 'active',
                start_date: { $lte: new Date() },
                end_date: { $gte: new Date() }
            });

            if (!voucher) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid or expired voucher'
                });
            }

            if (cart.totalAmount < voucher.min_order_value) {
                return res.status(400).json({
                    success: false,
                    message: `Minimum order value of ${voucher.min_order_value} required`
                });
            }

            let discountAmount = 0;
            switch(voucher.voucher_type) {
                case 'percentage':
                    discountAmount = (cart.totalAmount * voucher.discount_value) / 100;
                    if (voucher.max_discount) {
                        discountAmount = Math.min(discountAmount, voucher.max_discount);
                    }
                    break;
                case 'fixed_amount':
                    discountAmount = voucher.discount_value;
                    break;
            }

            cart.voucherCode = voucher_code;
            cart.discountAmount = discountAmount;
            cart.finalAmount = cart.totalAmount - discountAmount;
            
            await cart.save();

            // Update voucher usage count
            voucher.usage_count += 1;
            await voucher.save();

            res.status(200).json({
                success: true,
                data: cart
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = cartController;
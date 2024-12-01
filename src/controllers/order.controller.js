const Order = require('../models/order.model');
const Voucher = require('../models/voucher.model');
const Cart = require('../models/cart.model');

const orderController = {
    createOrder: async (req, res) => {
        try {
            // Get user's cart
            const cart = await Cart.findOne({ userId: req.user.userId })
                .populate('items.productId');
            
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cart is empty'
                });
            }

            const orderData = {
                userId: req.user.userId,
                items: cart.items,
                customerInfo: req.body.customerInfo,
                paymentDetails: req.body.paymentDetails,
                deliveryInfo: req.body.deliveryInfo,
                orderSummary: {
                    subtotal: cart.totalAmount,
                    deliveryFee: req.body.deliveryFee || 0,
                    discount: 0,
                    total: cart.totalAmount + (req.body.deliveryFee || 0)
                },
                specialInstructions: req.body.specialInstructions
            };

            const order = await Order.create(orderData);

            // Clear cart after order creation
            await Cart.findByIdAndUpdate(cart._id, {
                items: [],
                totalAmount: 0
            });

            res.status(201).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find()
                .sort('-createdAt')
                .populate('userId', 'name email');

            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    getUserOrders: async (req, res) => {
        try {
            const orders = await Order.find({ userId: req.user.userId })
                .sort('-createdAt');

            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    getOrderById: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Check if user is authorized to view this order
            if (!req.user.role === 'admin' && order.userId.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized'
                });
            }

            res.status(200).json({
                success: true,
                data: order
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
            const { voucherCode } = req.body;
            const order = await Order.findById(req.params.id);
            
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            const voucher = await Voucher.findOne({
                voucher_code: voucherCode,
                status: 'active'
            });

            if (!voucher) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid voucher'
                });
            }

            // Calculate discount
            let discountAmount = 0;
            if (voucher.voucher_type === 'percentage') {
                discountAmount = (order.orderSummary.subtotal * voucher.discount_value) / 100;
                if (voucher.max_discount) {
                    discountAmount = Math.min(discountAmount, voucher.max_discount);
                }
            } else if (voucher.voucher_type === 'fixed_amount') {
                discountAmount = voucher.discount_value;
            }

            // Update order with voucher
            order.appliedVouchers.push({
                voucherId: voucher._id,
                code: voucherCode,
                discountAmount
            });

            order.orderSummary.discount += discountAmount;
            order.orderSummary.total = 
                order.orderSummary.subtotal + 
                order.orderSummary.deliveryFee - 
                order.orderSummary.discount;

            await order.save();

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                { orderStatus: status },
                { new: true, runValidators: true }
            );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    cancelOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            if (!['pending', 'confirmed'].includes(order.orderStatus)) {
                return res.status(400).json({
                    success: false,
                    message: 'Order cannot be cancelled at this stage'
                });
            }

            order.orderStatus = 'cancelled';
            order.cancelReason = req.body.reason;
            await order.save();

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    updateOrder: async (req, res) => {
        try {
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                {
                    customerInfo: req.body.customerInfo,
                    paymentDetails: req.body.paymentDetails,
                    deliveryInfo: req.body.deliveryInfo,
                    specialInstructions: req.body.specialInstructions
                },
                { new: true, runValidators: true }
            );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Use mongoose-delete for soft deletion
            await order.delete();

            res.status(200).json({
                success: true,
                message: 'Order deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = orderController;
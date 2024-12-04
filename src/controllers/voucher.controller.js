const Voucher = require('../models/voucher.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');

const voucherController = {
    createVoucher: async (req, res) => {
        try {
            const voucher = await Voucher.create(req.body);
            res.status(201).json({
                success: true,
                data: voucher
            });
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.voucher_code) {
                return res.status(400).json({
                    success: false,
                    message: `Voucher code "${req.body.voucher_code}" already exists`
                });
            }
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllVouchers: async (req, res) => {
        try {
            const vouchers = await Voucher.find({ status: 'active' });
            res.status(200).json({
                success: true,
                data: vouchers
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    getVoucherById: async (req, res) => {
        try {
            const voucher = await Voucher.findById(req.params.id);
            if (!voucher) {
                return res.status(404).json({
                    success: false,
                    message: 'Voucher not found'
                });
            }
            res.status(200).json({
                success: true,
                data: voucher
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    updateVoucher: async (req, res) => {
        try {
            const voucher = await Voucher.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!voucher) {
                return res.status(404).json({
                    success: false,
                    message: 'Voucher not found'
                });
            }
            res.status(200).json({
                success: true,
                data: voucher
            });
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.voucher_code) {
                return res.status(400).json({
                    success: false,
                    message: `Voucher code "${req.body.voucher_code}" already exists`
                });
            }
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteVoucher: async (req, res) => {
        try {
            const voucher = await Voucher.findById(req.params.id);
            if (!voucher) {
                return res.status(404).json({
                    success: false,
                    message: 'Voucher not found'
                });
            }
            await voucher.delete();
            res.status(200).json({
                success: true,
                message: 'Voucher deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    validateVoucher: async (req, res) => {
        try {
            const { voucher_code } = req.body;
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

            if (voucher.usage_count >= voucher.usage_limit) {
                return res.status(400).json({
                    success: false,
                    message: 'Voucher usage limit reached'
                });
            }

            res.status(200).json({
                success: true,
                data: voucher
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    checkVoucher: async (req, res) => {
        try {
            const { voucher_code } = req.body;
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

            if (voucher.usage_count >= voucher.usage_limit) {
                return res.status(400).json({
                    success: false,
                    message: 'Voucher usage limit reached'
                });
            }

            const cart = await Cart.findOne({ userId: req.user.userId });
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart not found'
                });
            }

            if (cart.totalAmount < voucher.min_order_value) {
                return res.status(400).json({
                    success: false,
                    message: `Minimum order value of ${voucher.min_order_value} required`
                });
            }

            let discountAmount = 0;
            if (voucher.voucher_type === 'percentage') {
                discountAmount = (cart.totalAmount * voucher.discount_value) / 100;
                if (voucher.max_discount) {
                    discountAmount = Math.min(discountAmount, voucher.max_discount);
                }
            } else if (voucher.voucher_type === 'fixed_amount') {
                discountAmount = voucher.discount_value;
            }

            res.status(200).json({
                success: true,
                data: {
                    voucher_id: voucher._id,
                    voucher_code: voucher.voucher_code,
                    discount_amount: discountAmount
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = voucherController;
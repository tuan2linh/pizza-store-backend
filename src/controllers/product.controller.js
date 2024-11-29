const Product = require('../models/product.model');

const productController = {
    // Create new product
    createProduct: async (req, res) => {
        try {
            const product = await Product.create(req.body);
            res.status(201).json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all products
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find().populate('mainCategories');
            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get single product
    getProduct: async (req, res) => {
        try {
            console.log(req.params.id);
            const product = await Product.findById(req.params.id).populate('mainCategories');
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Update product
    updateProduct: async (req, res) => {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete product (soft delete)
    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            await product.delete();
            res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get filtered products by categories
    getFilteredProducts: async (req, res) => {
        try {
            const { mainCategories, subCategory } = req.query;
            let query = {};
            if (mainCategories) {
                query.mainCategories = { 
                    $in: Array.isArray(mainCategories) 
                        ? mainCategories 
                        : [mainCategories] 
                };
            }

            if (subCategory) {
                query.subCategory = { 
                    $in: Array.isArray(subCategory) 
                        ? subCategory 
                        : [subCategory] 
                };
            }

            const products = await Product.find(query);
            
            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = productController;


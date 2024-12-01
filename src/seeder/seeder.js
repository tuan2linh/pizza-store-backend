const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/product.model');
const Promotion = require('../models/promotion.model');
const { products } = require('./product');
const { promotions } = require('./promotion');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'pizza-store'
}).then(() => {
    console.log('MongoDB connected for seeding...');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

const seedProducts = async () => {
    try {
        await Product.deleteMany(); // Clear existing products
        console.log('Products deleted');

        // Insert products one by one to identify problematic records
        for (const product of products) {
            try {
                await Product.create(product);
                console.log(`Added product: ${product.name}`);
            } catch (err) {
                console.error(`Failed to add product ${product.name}:`, err.message);
                process.exit(1);
            }
        }

        console.log('Products seeded successfully');
    } catch (error) {
        console.error('Error seeding products:', error.message);
        process.exit(1);
    }
};

const seedPromotions = async () => {
    try {
        // First get all products to link with promotions
        const allProducts = await Product.find();
        
        // Create a map of product types
        const productMap = {
            pizza: allProducts.filter(p => p.mainCategories.includes('pizza')),
            chicken: allProducts.filter(p => p.mainCategories.includes('chicken')),
            drinks: allProducts.filter(p => p.mainCategories.includes('drinks')),
            vegetarian: allProducts.filter(p => p.subCategory.includes('vegetarian'))
        };

        await Promotion.deleteMany();
        console.log('Existing promotions deleted');

        // Process each promotion and link with actual product IDs
        for (const promo of promotions) {
            // Deep clone the promotion to avoid modifying the original
            const promoToSave = JSON.parse(JSON.stringify(promo));

            // Link required products if they exist
            if (promoToSave.conditions?.requiredProducts) {
                promoToSave.conditions.requiredProducts = promoToSave.conditions.requiredProducts.map(req => {
                    if (req.productId === null) {
                        // Assign appropriate product ID based on context
                        const products = productMap.pizza; // Default to pizza for demonstration
                        if (products && products.length > 0) {
                            req.productId = products[0]._id;
                        }
                    }
                    return req;
                });
            }

            // Link gift products if they exist
            if (promoToSave.benefits?.giftProducts) {
                promoToSave.benefits.giftProducts = promoToSave.benefits.giftProducts.map(gift => {
                    if (gift.productId === null) {
                        // Assign appropriate product ID based on context
                        const products = productMap.pizza; // Default to pizza for demonstration
                        if (products && products.length > 0) {
                            gift.productId = products[0]._id;
                        }
                    }
                    return gift;
                });
            }

            // Link specific products for fixed price promotions
            if (promoToSave.conditions?.specificProducts) {
                const pizzas = productMap.pizza.slice(0, 3); // Get first 3 pizzas
                promoToSave.conditions.specificProducts = pizzas.map(p => p._id);
            }

            try {
                await Promotion.create(promoToSave);
                console.log(`Added promotion: ${promoToSave.name}`);
            } catch (err) {
                console.error(`Failed to add promotion ${promoToSave.name}:`, err.message);
            }
        }

        console.log('Promotions seeded successfully');
    } catch (error) {
        console.error('Error seeding promotions:', error);
        process.exit(1);
    }
};

const seedAll = async () => {
    try {
        await seedProducts();
        await seedPromotions();
        console.log('All data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedAll();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/product.model');
const { products } = require('./product');

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
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error.message);
        process.exit(1);
    }
};

seedProducts();
# Pizza Store Backend API

A RESTful API backend service for a pizza store application built with Node.js, Express, and MongoDB.

## Features

- 🍕 Complete menu management (pizzas, sides, drinks)
- 👤 User authentication and authorization
- 🛒 Shopping cart functionality 
- 🎫 Promotion and voucher system
- 📦 Order management
- 🚚 Delivery tracking
- 📍 Multiple delivery address management

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- CORS enabled
- Soft delete functionality

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
```sh
npm install
```
3. Create a .env file in the root directory with:
```
PORT=8080
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```
4. Start the development server:
```
npm run dev
```
## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token

### Products

- `GET /api/products` - Get all products
- `GET /api/products/filter` - Get filtered products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/:itemId` - Update cart item
- `DELETE /api/cart/item/:itemId` - Remove item from cart
- `POST /api/cart/apply-voucher` - Apply voucher to cart

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/:id/voucher` - Apply voucher to order

### Promotions

- `GET /api/promotions` - Get all promotions
- `GET /api/promotions/active` - Get active promotions
- `POST /api/promotions/validate` - Validate promotion
- `POST /api/promotions` - Create promotion (Admin)
- `PUT /api/promotions/:id` - Update promotion (Admin)

  ## Project Structure
```
src/
  ├── config/         # Configuration files
  ├── controllers/    # Route controllers
  ├── middleware/     # Custom middleware
  ├── models/         # Mongoose models
  ├── routes/         # Route definitions
  └── seeder/         # Database seeders
```

## Database Seeding
To populate the database with sample data:
```
node src/seeder/seeder.js
```

## Running Tests
Currently no tests have been implemented. You can add tests using Jest or Mocha.

## Contributing
 - Fork repository
 - Create feature branch
 - Commit changes
 - Push to branch
 - Create Pull Request
## License
This project is licensed under the ISC License



















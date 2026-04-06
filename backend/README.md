# Catering Management System - Backend

Node.js + Express + MongoDB backend API for the Catering Management System.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Install MongoDB
Make sure MongoDB is installed and running on your system.
- Download: https://www.mongodb.com/try/download/community
- Start MongoDB service

### 3. Environment Variables
The `.env` file is already created. Update if needed:
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Menu
- `GET /api/menu/packages` - Get all packages
- `GET /api/menu/packages/:id` - Get package by ID
- `POST /api/menu/packages` - Create package (Admin)
- `PUT /api/menu/packages/:id` - Update package (Admin)
- `DELETE /api/menu/packages/:id` - Delete package (Admin)
- `GET /api/menu/foods` - Get all food items
- `GET /api/menu/foods/available` - Get available foods
- `POST /api/menu/foods` - Create food item (Admin)
- `PUT /api/menu/foods/:id` - Update food item (Admin)
- `DELETE /api/menu/foods/:id` - Delete food item (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/payment` - Update payment status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Quotations
- `POST /api/quotations` - Create quotation request
- `GET /api/quotations/my-quotations` - Get user's quotations
- `GET /api/quotations` - Get all quotations (Admin)
- `GET /api/quotations/:id` - Get quotation by ID
- `PUT /api/quotations/:id` - Update quotation (Admin)
- `DELETE /api/quotations/:id` - Delete quotation (Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin)

## Project Structure
```
backend/
├── models/           # Database models
│   ├── User.js
│   ├── Menu.js
│   ├── Order.js
│   └── Quotation.js
├── routes/           # API routes
│   ├── auth.js
│   ├── menu.js
│   ├── order.js
│   ├── quotation.js
│   └── user.js
├── middleware/       # Custom middleware
│   └── auth.js
├── uploads/          # Uploaded files (created automatically)
├── .env             # Environment variables
├── server.js        # Main server file
└── package.json     # Dependencies
```

## Testing the API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example login request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

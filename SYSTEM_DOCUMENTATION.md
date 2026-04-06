# 🍱 Catering Management System

A modern, full-featured web-based catering management system built with Vue 3, Vite, and Pinia. This system provides a comprehensive solution for catering businesses to manage orders, menus, events, and sales efficiently.

## ✨ Features

### Customer Features
- ✅ **User Registration & Login** - Secure authentication system
- 🍽️ **Browse Food Menu** - Interactive menu with package selection
- 🛒 **Shopping Cart** - Add, remove, and manage cart items
- 📝 **Place Orders** - Full order placement with event details
- 💰 **Submit Quotation Requests** - Request custom quotes
- 💳 **Online Payment** - Multiple payment methods (Card, FPX, E-Wallet)
- 📋 **View Order History** - Track all orders and their status
- 🚚 **Track Delivery Status** - Real-time delivery tracking

### Admin Features
- 👨‍💼 **Admin Dashboard** - Overview of all business metrics
- 📦 **Manage Orders** - View and update order status
- 🍱 **Manage Food Menu** - Add, edit, and delete menu items
- 📅 **Event Schedule** - Calendar view of all scheduled events
- 🚚 **Update Delivery Status** - Track and update deliveries
- 📊 **Generate Sales Reports** - Comprehensive analytics and export to CSV

## 🚀 Technology Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Scoped CSS

## 📁 Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable components
│   └── Navbar.vue   # Navigation bar
├── router/          # Vue Router configuration
│   └── index.js     # Routes and navigation guards
├── stores/          # Pinia state management
│   ├── auth.js      # Authentication store
│   ├── cart.js      # Shopping cart store
│   ├── menu.js      # Menu management store
│   └── orders.js    # Orders management store
├── views/           # Page components
│   ├── Login.vue
│   ├── Register.vue
│   ├── Dashboard.vue
│   ├── Menu.vue
│   ├── Cart.vue
│   ├── Checkout.vue
│   ├── Payment.vue
│   ├── PaymentSuccess.vue
│   ├── Orders.vue
│   ├── AdminDashboard.vue
│   ├── AdminOrders.vue
│   ├── AdminMenu.vue
│   ├── AdminEvents.vue
│   └── AdminReports.vue
├── App.vue
└── main.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20.19.0 or higher
- npm or yarn

### Installation Steps

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Build for production**
```bash
npm run build
```

4. **Preview production build**
```bash
npm run preview
```

## 👤 User Roles & Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Features**: Full access to management features

### Customer Account
- **Register**: Create a new account via Register page
- **Or use any username/password**: System will auto-create customer account
- **Features**: Browse menu, place orders, track deliveries

## 📋 Use Cases Implemented

### Customer Use Cases
1. ✅ Register Customer Account
2. ✅ Login to System
3. ✅ Browse Food Menu
4. ✅ Manage Shopping Cart
5. ✅ Place Catering Order
6. ✅ Submit Quotation Request
7. ✅ Make Online Payment
8. ✅ View Order History

### Admin Use Cases
1. ✅ Admin Login
2. ✅ Manage Food Menu
3. ✅ Manage Event Schedule
4. ✅ Update Order Status
5. ✅ Track Delivery Status
6. ✅ Generate Sales Reports

## 🎨 Key Features Explained

### Menu Selection
- **Package-based System**: Choose from Basic, Standard, Premium, or Deluxe packages
- **Customization**: Select up to 8 food items, 3 drinks, and 3 cakes
- **Dynamic Pricing**: Real-time price calculation based on number of guests

### Shopping Cart
- **Persistent Storage**: Cart items saved in localStorage
- **Quantity Management**: Increase/decrease quantities
- **Price Calculation**: Automatic subtotal and total calculation

### Order Management
- **Order Tracking**: View order status (Pending, Confirmed, Preparing, Completed)
- **Delivery Tracking**: Real-time delivery status updates
- **Event Details**: Complete event information (date, time, location, guests)

### Payment System
- **Multiple Methods**: Credit/Debit Card, FPX Online Banking, E-Wallets
- **Secure Processing**: Form validation and secure data handling
- **Order Confirmation**: Success page with order number

### Admin Dashboard
- **Statistics Overview**: Total orders, pending orders, revenue, menu items
- **Quick Actions**: Direct links to key management features
- **Recent Orders**: Latest order information at a glance

### Event Calendar
- **Monthly View**: Calendar display of all scheduled events
- **Event Details**: Customer info, order details, contact information
- **Navigation**: Easy month-to-month navigation

### Sales Reports
- **Date Filtering**: Generate reports for specific date ranges
- **Multiple Metrics**: Total sales, order count, average order value
- **Visualizations**: Charts for order status distribution
- **Export Function**: Download reports as CSV files

## 🔐 Authentication & Authorization

- **Role-based Access**: Separate routes and permissions for admin and customers
- **Navigation Guards**: Automatic redirection based on authentication status
- **Persistent Sessions**: Login state maintained using localStorage
- **Secure Routing**: Protected routes require authentication

## 💾 Data Persistence

All data is stored in browser localStorage:
- User authentication tokens
- Shopping cart items
- Order history
- Menu configurations

**Note**: In production, replace with proper backend API integration.

## 🎯 Future Enhancements

- Backend API integration
- Real payment gateway integration
- Email notifications
- SMS notifications for order updates
- Image upload for menu items
- Advanced reporting with charts
- Customer reviews and ratings
- Multi-language support
- Mobile responsive improvements

## 🐛 Known Limitations

- Data stored in localStorage (client-side only)
- Mock authentication (replace with real auth system)
- No actual payment processing (simulation only)
- Limited to single browser session

## 📝 Development Notes

### State Management (Pinia)
The system uses Pinia for centralized state management:
- **authStore**: User authentication and session
- **cartStore**: Shopping cart functionality
- **menuStore**: Menu items and packages
- **ordersStore**: Order management

### Component Architecture
- **Modular Design**: Reusable components (Navbar)
- **Scoped Styling**: Component-specific CSS
- **Reactive Data**: Vue 3 Composition API features

## 🤝 Contributing

This is an academic project for Final Year Project. For improvements or bug fixes:
1. Document the issue
2. Create a detailed plan
3. Test thoroughly before implementing

## 📄 License

This project is created for academic purposes.

## 👨‍💻 Developer

Developed as part of Final Year Project 1
- Institution: UUM
- Semester: 5
- Project: Catering Management System

---

**Note**: This is a frontend-only implementation. For production use, integrate with a proper backend API, database, and payment gateway.

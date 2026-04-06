# 🚀 Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Your Browser
Navigate to: `http://localhost:5173`

---

## 🔑 Login Credentials

### Admin Access
```
Username: admin
Password: admin123
```
**Admin Dashboard URL**: `/admin/dashboard`

### Customer Access
**Option 1**: Register a new account
- Click "Register Account" on login page
- Fill in the registration form

**Option 2**: Quick test login
- Use any username/password combination
- System will auto-create a customer account

---

## 📱 System Navigation

### Customer Flow
1. **Login/Register** → Home page
2. **Dashboard** → View overview and quick links
3. **Menu** → Browse packages and customize order
4. **Cart** → Review and manage cart items
5. **Checkout** → Enter event details
6. **Payment** → Select payment method
7. **Orders** → Track order status

### Admin Flow
1. **Admin Login** → Admin dashboard
2. **Orders Management** → View and update orders
3. **Menu Management** → Add/edit packages and food items
4. **Event Schedule** → Calendar view of events
5. **Sales Reports** → Analytics and export

---

## 🎯 Testing Scenarios

### Test Order Flow (Customer)
1. Login as customer
2. Go to Menu
3. Select a package (e.g., Package A)
4. Choose number of guests (e.g., 50 pax)
5. Select food items, drinks, and cakes
6. Click "Add to Cart"
7. Go to Cart and review
8. Click "Proceed to Checkout"
9. Fill in event details:
   - Event Date: Any future date
   - Event Time: e.g., 18:00
   - Location: Any address
   - Number of Guests: 50
10. Select "Place Order"
11. Choose payment method
12. Complete payment
13. View order confirmation

### Test Order Management (Admin)
1. Login as admin
2. Go to Admin Dashboard
3. View statistics and recent orders
4. Click "Manage Orders"
5. Change order status (e.g., Pending → Confirmed)
6. Update delivery status
7. Click "Details" to view full order info

### Test Menu Management (Admin)
1. Login as admin
2. Go to Menu Management
3. Add a new package:
   - Name: "Package E - VIP"
   - Price: 35
   - Description: "Exclusive catering"
   - Max Pax: 300
4. Add a new food item:
   - Name: "Lamb Curry"
   - Category: Main Dish
5. Toggle food availability

### Test Reports (Admin)
1. Login as admin
2. Go to Sales Reports
3. Select date range
4. Click "Generate Report"
5. Review statistics and charts
6. Click "Export to CSV"

---

## 🛠️ Development Tips

### Hot Module Replacement (HMR)
Changes to `.vue` files automatically reload in browser - no need to refresh!

### Vue DevTools
Install Vue DevTools browser extension for debugging:
- Chrome: [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### Clearing Data
To reset all data (cart, orders, auth):
1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Refresh page

### Checking Current State
View Pinia stores in Vue DevTools:
1. Open Vue DevTools
2. Click "Pinia" tab
3. Explore authStore, cartStore, menuStore, ordersStore

---

## 📂 Key Files to Understand

### Stores (State Management)
- `src/stores/auth.js` - User authentication
- `src/stores/cart.js` - Shopping cart logic
- `src/stores/menu.js` - Menu data
- `src/stores/orders.js` - Order management

### Routes
- `src/router/index.js` - All application routes and guards

### Main Components
- `src/components/Navbar.vue` - Navigation bar
- `src/views/Menu.vue` - Menu browsing
- `src/views/Cart.vue` - Shopping cart
- `src/views/Checkout.vue` - Order checkout
- `src/views/AdminDashboard.vue` - Admin overview

---

## ❓ Common Issues

### Port Already in Use
If port 5173 is occupied:
```bash
npm run dev -- --port 3000
```

### Dependencies Error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
Ensure you're using Node.js 20.19.0 or higher:
```bash
node --version
```

---

## 📞 Need Help?

1. Check `SYSTEM_DOCUMENTATION.md` for detailed features
2. Review component code for implementation details
3. Use Vue DevTools for debugging

---

**Happy Coding! 🎉**

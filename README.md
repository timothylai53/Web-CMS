# CaterFlow — Catering Management System

A multi-provider catering marketplace built as my Final Year Project at Universiti Utara Malaysia (UUM). Customers can browse packages from different caterers, customise a menu, then place and pay for an order or ask for a quotation. Caterers run their menus, orders, kitchen inventory and events from their own dashboard. A super admin approves new caterers and manages the platform.

## Features

**Customers**
- Browse packages from several caterers and customise food, drinks and desserts within each package's limits
- See the price update live as the guest count (pax) changes
- Cart and checkout with event details, dietary notes and special requests
- Pay online with Stripe, or ask for a quotation instead
- Order history, quotation tracking, and chat with the caterer
- **CaterFlow AI**: a Gemini-powered assistant that recommends caterers and packages based on budget, guest count and location

**Catering providers**
- Sign up with an F&B licence; super admin approval required
- Menu and package management, isolated per provider
- Order and quotation handling, event calendar, and delivery status tracking
- Kitchen inventory, equipment and logistics tracking
- Sales reports and a dashboard

**Super admin**
- Approve or reject provider applications
- Activate or deactivate user accounts, view platform statistics and change settings

**Platform**
- JWT authentication with role-based routes for customer, provider and super admin
- Password reset and order emails through SendGrid
- File uploads in chat

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | Vue 3, Vite, Pinia, Vue Router, Axios |
| Backend | Node.js, Express, Mongoose, express-validator, Multer |
| Database | MongoDB |
| Integrations | Stripe (payments), SendGrid (email), Google Gemini (AI assistant) |
| Auth | JWT, bcrypt |

## Project structure

```
src/                 Vue frontend
  views/             customer, provider (CateringProvider*) and super admin (SuperAdmin*) pages
  stores/            Pinia stores: auth, cart, menu, orders
  services/api.js    Axios client
backend/
  server.js          Express entry point
  routes/            auth, menu, order, quotation, payment, provider, admin, inventory, chat, ai
  models/            User, Menu, Order, Quotation, InventoryItem, PackList, Message
  services/          SendGrid email and Gemini recommendation services
  middleware/        JWT authentication
  migrations/        data migration scripts
```

## Running locally

Prerequisites: Node.js 20+ and MongoDB, either local or Atlas.

```bash
# 1. Backend
cd backend
cp .env.example .env        # fill in MONGODB_URI, JWT_SECRET and any API keys
npm install
npm run seed                # optional: sample data
npm run dev                 # http://localhost:5000

# 2. Frontend (in a second terminal, from the project root)
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

Stripe, SendGrid and Gemini keys are optional for local development. The features that use them won't work without their keys.

## More documentation

- [System documentation](SYSTEM_DOCUMENTATION.md)
- [Full feature list](FEATURES_LIST.md)
- [Quotation workflow](QUOTATION_WORKFLOW.md)
- [Kitchen inventory system](KITCHEN_INVENTORY_SYSTEM.md)
- [Role system](ROLE_SYSTEM_RESTRUCTURE.md)
- [Test guide](TEST_GUIDE.md) and [test results](TEST_RESULTS.md)

## Author

**Timothy Lai Jun Hong**, Software Engineering, UUM: [GitHub](https://github.com/timothylai53) · [Portfolio](https://timothylai53.github.io/) · [LinkedIn](https://www.linkedin.com/in/timothy-lai-jun-hong-597442118/)

# Role System Restructure - Complete Implementation Guide

## 📋 Overview
The catering management system has been completely restructured to support a 3-tier role system with provider approval workflow.

---

## 🎯 New Role Structure

### 1. **Customer** (Previously: Customer)
- **Access**: Menu browsing, ordering, quotation requests
- **Routes**: `/dashboard`, `/menu`, `/cart`, `/checkout`, `/orders`, `/quotations`
- **Registration**: Instant approval, immediate access

### 2. **Catering Provider** (Previously: Admin)
- **Access**: Menu management, order management, quotation handling, reports
- **Routes**: `/provider/dashboard`, `/provider/menu`, `/provider/orders`, `/provider/quotations`, `/provider/events`, `/provider/reports`
- **Registration**: Requires admin approval after submitting F&B license
- **Approval Status**:
  - `pending` - Awaiting super admin review
  - `approved` - Can access provider dashboard
  - `rejected` - Application denied with reason

### 3. **Super Admin** (New)
- **Access**: Full platform management
- **Routes**: `/superadmin/dashboard`, `/superadmin/provider-approval`, `/superadmin/user-management`, `/superadmin/settings`
- **Capabilities**:
  - Approve/reject provider applications
  - Activate/deactivate user accounts
  - View system statistics
  - Configure platform settings

---

## 🔄 What Changed

### Backend Changes

#### 1. **User Model** (`backend/models/User.js`)
**New Fields:**
```javascript
{
  role: String,                    // 'customer' | 'cateringProvider' | 'superadmin'
  businessName: String,            // Provider's business name
  licenseDocument: String,         // Base64 encoded F&B license
  approvalStatus: String,          // 'pending' | 'approved' | 'rejected'
  rejectionReason: String,         // Reason for rejection
  isActive: Boolean               // Account activation status
}
```

#### 2. **Middleware** (`backend/middleware/auth.js`)
**New Functions:**
- `isCateringProvider()` - Check if user is a catering provider
- `isSuperAdmin()` - Check if user is super admin
- `isApprovedProvider()` - Check if provider is approved
- `isAdmin()` - Legacy alias for backward compatibility

#### 3. **Admin Routes** (`backend/routes/admin.js`) - NEW FILE
**Endpoints:**

**Provider Management:**
- `GET /api/admin/providers/pending` - List pending applications
- `GET /api/admin/providers` - List all providers
- `PUT /api/admin/providers/:id/approve` - Approve provider
- `PUT /api/admin/providers/:id/reject` - Reject provider with reason

**User Management:**
- `GET /api/admin/customers` - List all customers
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/toggle-status` - Activate/deactivate user

**System Management:**
- `GET /api/admin/statistics` - System statistics
- `GET /api/admin/config` - Get configuration
- `PUT /api/admin/config` - Update configuration

#### 4. **Seed Data** (`backend/seed.js`)
**Updated Test Users:**
```javascript
// Super Admin
Email: superadmin@catering.com
Password: superadmin123

// Catering Provider (Approved)
Email: provider@catering.com
Password: provider123

// Customer
Email: customer@example.com
Password: customer123
```

---

### Frontend Changes

#### 1. **Registration Page** (`src/views/Register.vue`)
**New Features:**
- Role selection (Customer vs Catering Provider)
- Business name field (conditional - providers only)
- F&B license upload (conditional - providers only)
- File upload validation (5MB limit, PDF/JPG/PNG)
- Different success messages based on role

**Registration Flow:**
- **Customer**: Register → Auto-approve → Redirect to dashboard
- **Provider**: Register → Submit application → Redirect to login → Wait for approval

#### 2. **Authentication Store** (`src/stores/auth.js`)
**New Getters:**
- `isCateringProvider` - Check if catering provider
- `isSuperAdmin` - Check if super admin
- `isProviderPending` - Check if provider approval pending
- `isProviderApproved` - Check if provider approved
- `isProviderRejected` - Check if provider rejected
- `isAccountActive` - Check if account is active

**Login Logic Updates:**
- Check account activation status
- Check provider approval status
- Return specific error messages for pending/rejected providers
- Auto-logout inactive accounts

#### 3. **Router Configuration** (`src/router/index.js`)
**New Routes:**

**Super Admin:**
- `/superadmin/dashboard` - Statistics overview
- `/superadmin/provider-approval` - Review applications
- `/superadmin/user-management` - Manage all users
- `/superadmin/settings` - System configuration

**Catering Provider (renamed from /admin):**
- `/provider/dashboard` (was `/admin/dashboard`)
- `/provider/menu` (was `/admin/menu`)
- `/provider/orders` (was `/admin/orders`)
- `/provider/quotations` (was `/admin/quotations`)
- `/provider/events` (was `/admin/events`)
- `/provider/reports` (was `/admin/reports`)

**Legacy Support:**
- Old `/admin/*` routes automatically redirect to `/provider/*`

**Enhanced Navigation Guards:**
- Role-based access control
- Approval status checking for providers
- Account activation checking
- Automatic routing based on user role

#### 4. **File Renames**
**Old → New:**
- `AdminDashboard.vue` → `CateringProviderDashboard.vue`
- `AdminMenu.vue` → `CateringProviderMenu.vue`
- `AdminOrders.vue` → `CateringProviderOrders.vue`
- `AdminQuotations.vue` → `CateringProviderQuotations.vue`
- `AdminEvents.vue` → `CateringProviderEvents.vue`
- `AdminReports.vue` → `CateringProviderReports.vue`

#### 5. **New Super Admin Pages**

**SuperAdminDashboard.vue**
- System statistics (total users, providers, customers)
- Pending applications count
- Quick action buttons
- Recent activity feed

**SuperAdminProviderApproval.vue**
- Tabbed interface (Pending/Approved/Rejected)
- Application cards with provider details
- License document viewer
- Approve/reject with reason modal

**SuperAdminUserManagement.vue**
- User listing table
- Search and filter functionality
- Activate/deactivate accounts
- View user details modal

**SuperAdminSettings.vue**
- Platform information
- Maintenance mode toggle
- Provider approval settings
- Registration settings
- System actions (cache, export, logs)

---

## 🚀 Testing Guide

### 1. **Test Customer Registration**
1. Navigate to `/register`
2. Select "Customer" role
3. Fill in details
4. Submit
5. ✅ Should auto-login and redirect to `/dashboard`

### 2. **Test Provider Registration**
1. Navigate to `/register`
2. Select "Catering Provider" role
3. Fill in business name
4. Upload F&B license (PDF/JPG/PNG)
5. Submit
6. ✅ Should show "Pending approval" message and redirect to login

### 3. **Test Provider Login (Pending)**
1. Try logging in with pending provider account
2. ✅ Should show error: "Your application is pending approval"

### 4. **Test Super Admin Approval**
1. Login as `superadmin@catering.com` / `superadmin123`
2. Navigate to `/superadmin/provider-approval`
3. Review pending application
4. Click "View F&B License"
5. Click "Approve" or "Reject" (with reason)
6. ✅ Provider status should update

### 5. **Test Approved Provider Login**
1. Login with approved provider account
2. ✅ Should redirect to `/provider/dashboard`
3. ✅ Should have access to all provider routes

### 6. **Test User Management**
1. Login as super admin
2. Navigate to `/superadmin/user-management`
3. Filter by role (All/Customers/Providers)
4. Search by name/email
5. Deactivate a user
6. ✅ User should be unable to login

---

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  fullName: String,
  phone: String,
  address: String,
  role: String,                    // NEW: 'customer' | 'cateringProvider' | 'superadmin'
  businessName: String,            // NEW: Provider business name
  licenseDocument: String,         // NEW: Base64 F&B license
  approvalStatus: String,          // NEW: 'pending' | 'approved' | 'rejected'
  rejectionReason: String,         // NEW: Rejection reason
  isActive: Boolean,               // NEW: Account status
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Considerations

1. **JWT Tokens**: All API requests require valid JWT token
2. **Role Validation**: Backend validates user role on every protected route
3. **Approval Status**: Providers can't access routes until approved
4. **Account Status**: Deactivated users are auto-logged out
5. **File Upload**: License documents limited to 5MB
6. **Super Admin Protection**: Can't deactivate super admin accounts

---

## 🐛 Known Issues & Fixes

### Issue: Provider tries to access dashboard before approval
**Fix**: Router guard checks `approvalStatus` and redirects to login

### Issue: Legacy admin routes not working
**Fix**: Added redirect routes from `/admin/*` to `/provider/*`

### Issue: File upload too large
**Fix**: Added 5MB validation before upload

---

## 📝 Next Steps (Optional Enhancements)

1. **Email Notifications**
   - Send email when provider is approved/rejected
   - Send email to admin when new provider registers

2. **Advanced Provider Management**
   - Provider ratings and reviews
   - Provider performance metrics
   - Subscription/payment integration

3. **Enhanced Security**
   - Two-factor authentication
   - Password reset functionality
   - Session management

4. **Analytics Dashboard**
   - Revenue tracking
   - Popular menu items
   - Customer behavior analytics

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <process_id> /F

# Restart backend
cd backend
node server.js
```

### Frontend shows blank page
```bash
# Clear cache and rebuild
cd ..
npm run dev
```

### Database connection failed
- Check MongoDB Atlas connection string
- Verify IP whitelist in MongoDB Atlas
- Check network connectivity

### Provider can't login after approval
- Verify `approvalStatus` is set to 'approved' in database
- Check `isActive` is set to `true`
- Clear browser cache and localStorage

---

## 📞 Support

For any issues or questions:
1. Check console errors (F12 in browser)
2. Check backend terminal logs
3. Verify database records in MongoDB Atlas
4. Test with provided seed accounts

---

## ✅ Completion Checklist

- [x] Backend User model updated
- [x] Backend middleware updated
- [x] Backend admin routes created
- [x] Seed data updated
- [x] Registration page updated
- [x] Auth store updated
- [x] Router configuration updated
- [x] Admin files renamed to CateringProvider
- [x] Super Admin dashboard created
- [x] Provider approval page created
- [x] User management page created
- [x] System settings page created
- [x] Login routing updated
- [x] Documentation added

---

**System Status**: ✅ **FULLY OPERATIONAL**

All changes have been implemented and tested. The system is ready for use with the new 3-tier role structure.

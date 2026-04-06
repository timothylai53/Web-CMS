# Quick Testing Guide

## 🚀 Servers Running
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:5173

## 🧪 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@example.com | customer123 |
| Provider | provider@catering.com | provider123 |
| Super Admin | superadmin@catering.com | superadmin123 |

---

## 📋 Quick Test Checklist

### Test 1: Customer Login ✅
**Steps:**
1. Open http://localhost:5173/
2. Enter username: `customer@example.com`
3. Enter password: `customer123`
4. Click Login
5. **Expected**: Redirect to `/dashboard`

**Verify:**
- [ ] Login successful
- [ ] Redirected to customer dashboard
- [ ] Press F12 → Console → Check user object has all fields
- [ ] User should have: fullName="Jane Customer", phone="012-1234567", role="customer"

---

### Test 2: Provider Login ✅
**Steps:**
1. Logout (if logged in)
2. Enter username: `provider@catering.com`
3. Enter password: `provider123`
4. Click Login
5. **Expected**: Redirect to `/provider/dashboard`

**Verify:**
- [ ] Login successful
- [ ] Redirected to provider dashboard
- [ ] Check console: approvalStatus="approved", businessName="Delicious Catering Services"
- [ ] Can access provider menu, orders, etc.

---

### Test 3: Super Admin Login ✅
**Steps:**
1. Logout
2. Enter username: `superadmin@catering.com`
3. Enter password: `superadmin123`
4. Click Login
5. **Expected**: Redirect to `/superadmin/dashboard`

**Verify:**
- [ ] Login successful
- [ ] Redirected to super admin dashboard
- [ ] Can see statistics (users, providers, customers)
- [ ] Can navigate to Provider Approval page
- [ ] Can navigate to User Management page

---

### Test 4: Provider Registration & Approval ✅
**Steps:**

**Part A: Register New Provider**
1. Logout
2. Click "Create Account"
3. Fill in:
   - Username: `testprovider`
   - Email: `test@provider.com`
   - Password: `test123`
   - Full Name: `Test Provider`
   - Phone: `012-5555555`
   - Address: `Test Address`
   - Role: **Catering Provider**
   - Business Name: `Test Catering Co`
4. Upload a sample image (any JPG/PNG) as F&B License
5. Click Register
6. **Expected**: Message "Application submitted. Awaiting approval"

**Part B: Try to Login (Should Fail)**
7. Try to login with `test@provider.com` / `test123`
8. **Expected**: Error "Your application is pending approval"

**Part C: Approve as Super Admin**
9. Logout and login as superadmin
10. Go to `/superadmin/provider-approval`
11. Click "Pending" tab
12. Find "Test Provider" application
13. Click "View F&B License" (verify image displays)
14. Click "Approve"
15. **Expected**: Success message, provider moves to "Approved" tab

**Part D: Login as Approved Provider**
16. Logout
17. Login as `test@provider.com` / `test123`
18. **Expected**: Successful login, redirect to `/provider/dashboard`

---

### Test 5: User Management (Deactivate Account) ✅
**Steps:**

**Part A: Deactivate User**
1. Login as superadmin
2. Go to `/superadmin/user-management`
3. Find "Test Provider" (test@provider.com)
4. Click "Deactivate" button
5. **Expected**: Status changes to "Inactive"

**Part B: Try to Login (Should Fail)**
6. Logout
7. Try to login as `test@provider.com` / `test123`
8. **Expected**: Error "Your account has been deactivated"

**Part C: Reactivate User**
9. Login as superadmin
10. Go to User Management
11. Click "Activate" on Test Provider
12. **Expected**: Status changes to "Active"

**Part D: Login Works Again**
13. Logout
14. Login as `test@provider.com` / `test123`
15. **Expected**: Successful login

---

### Test 6: Menu Management ✅
**Steps:**
1. Login as `provider@catering.com`
2. Navigate to `/provider/menu`
3. Open browser DevTools (F12) → Network tab
4. Check API calls:
   - Should see: `GET /api/menu/packages` (Status 200)
   - Should see: `GET /api/menu/foods` (Status 200)
5. **Expected**: Menu items display correctly

**Verify:**
- [ ] Packages list loads
- [ ] Food items list loads
- [ ] Can add new package
- [ ] Can edit package
- [ ] Can delete package

---

### Test 7: Order System ✅
**Steps:**

**Part A: Create Order (Customer)**
1. Login as `customer@example.com`
2. Browse menu packages
3. Add items to cart
4. Go to cart/checkout
5. Place order
6. **Expected**: Order confirmation

**Part B: View Order (Provider)**
7. Logout and login as `provider@catering.com`
8. Navigate to orders page
9. **Expected**: See customer's order
10. Update order status
11. **Expected**: Status updates successfully

---

### Test 8: Quotation System ✅
**Steps:**

**Part A: Request Quotation (Customer)**
1. Login as customer
2. Navigate to quotations
3. Create new quotation request
4. **Expected**: Quotation submitted

**Part B: Respond to Quotation (Provider)**
5. Logout and login as provider
6. View pending quotations
7. Respond to customer request
8. **Expected**: Response sent successfully

---

## 🔍 Debugging Tips

### If Login Fails
1. Open DevTools (F12) → Console tab
2. Check for errors
3. Go to Network tab
4. Look for `POST /api/auth/login`
5. Check response:
   - Status 200 = Success
   - Status 400/401 = Invalid credentials
   - Status 500 = Server error

### Check User Data
After successful login, in console type:
```javascript
localStorage.getItem('user')
```
Should return user object with all fields:
- id, username, email, fullName, phone, address
- role, businessName (if provider)
- approvalStatus, isActive

### Check Token
```javascript
localStorage.getItem('token')
```
Should return JWT token string

### Clear Cache
If weird behavior:
```javascript
localStorage.clear()
```
Then refresh page and login again

---

## ✅ Expected Results Summary

| Test | Expected Outcome |
|------|------------------|
| Customer Login | Redirect to /dashboard |
| Provider Login | Redirect to /provider/dashboard |
| Super Admin Login | Redirect to /superadmin/dashboard |
| Pending Provider Login | Error message "pending approval" |
| Deactivated User Login | Error message "account deactivated" |
| Provider Approval | Status changes, can login after |
| Menu Load | API calls succeed, data displays |
| Order Creation | Order saved, visible to provider |
| Quotation Request | Request saved, visible to provider |

---

## 🐛 Common Issues

### "White Page"
- Check console for errors
- Verify both servers running
- Clear browser cache
- Check router configuration

### "Network Error"
- Backend not running
- Wrong API URL
- CORS issues
- Firewall blocking

### "Invalid Token"
- Token expired
- Clear localStorage
- Login again

### "Approval Status Not Updating"
- Check database directly in MongoDB Atlas
- Verify API call succeeded (Network tab)
- Refresh page

---

## 🎯 What to Test Now

**Priority 1 (Critical):**
1. ✅ Customer login
2. ✅ Provider login  
3. ✅ Super admin login
4. ✅ Provider approval workflow

**Priority 2 (Important):**
5. ✅ User deactivation
6. ✅ Menu management
7. ✅ Registration (customer & provider)

**Priority 3 (Nice to Have):**
8. ✅ Order system
9. ✅ Quotation system
10. ✅ Reports & analytics

---

**Start with Test 1 (Customer Login) and work through the list!** 🚀

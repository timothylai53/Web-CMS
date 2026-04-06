# 📋 Quotation Request Workflow Guide

## Overview
The quotation system allows customers to request custom catering quotes from providers. This document explains the complete workflow from request to order placement.

---

## 🔄 Complete Workflow

### **STEP 1: Customer Requests Quotation**

**From:** Customer Dashboard → My Quotations Page  
**Action:** Click "➕ New Request" button

**Customer Fills Form:**
- Customer Name * (pre-filled from profile)
- Email * (pre-filled from profile)
- Phone Number * (pre-filled from profile)
- Event Date * (minimum 1 day ahead)
- Event Time (optional)
- Event Location *
- Number of Guests *
- Event Type (wedding, birthday, corporate, etc.)
- Additional Requirements (dietary restrictions, special requests)

**Submit:**
- Customer clicks "Submit Request"
- System creates quotation with status: `pending`
- Customer sees confirmation: "✓ Quotation request submitted successfully!"
- Quotation appears in customer's "Pending" tab

**Database Record Created:**
```javascript
{
  _id: "...",
  userId: "customer_id",
  customerName: "Jane Customer",
  email: "customer@example.com",
  phoneNumber: "012-3456789",
  eventDate: "2026-02-15",
  eventTime: "18:00",
  location: "Grand Ballroom, KL",
  numberOfGuests: 100,
  eventType: "wedding",
  additionalRequests: "Halal food required, vegetarian options needed",
  status: "pending",
  quotedAmount: null,
  adminNotes: "",
  createdAt: "2026-01-16T10:30:00Z",
  updatedAt: "2026-01-16T10:30:00Z"
}
```

---

### **STEP 2: Provider Reviews Request**

**From:** Provider Dashboard → Quotations Management  
**Access:** `/provider/quotations`

**Provider Sees:**
- List of all quotation requests
- Tabs: Pending | Reviewed | Quoted | Accepted | Rejected
- Request details:
  - Customer name, email, phone
  - Event date, time, location
  - Number of guests
  - Event type
  - Special requirements

**Provider Actions:**
1. Review customer requirements
2. Calculate costs based on:
   - Number of guests
   - Event complexity
   - Special requirements
   - Date availability

---

### **STEP 3: Provider Sends Quotation**

**Provider Fills:**
- Quoted Amount (RM)
- Admin Notes/Response (explanation of pricing, included items, terms)

**Submit:**
- Provider clicks "Send Quotation"
- System updates quotation:
  - Status: `pending` → `quoted`
  - Sets `quotedAmount`
  - Sets `adminNotes`
  - Records `quotedAt` timestamp

**Updated Database Record:**
```javascript
{
  _id: "...",
  userId: "customer_id",
  customerName: "Jane Customer",
  // ... other fields ...
  status: "quoted",
  quotedAmount: 2675.00,
  adminNotes: "Package includes: Premium buffet setup, 5 main dishes, 3 sides, 2 drinks, dessert. Includes setup and cleanup. 10% discount for bookings 30+ days ahead.",
  quotedAt: "2026-01-16T14:00:00Z",
  updatedAt: "2026-01-16T14:00:00Z"
}
```

---

### **STEP 4: Customer Reviews Quotation**

**Notification:**
- Customer sees quotation in "Quoted" tab
- Quotation card shows:
  - 💼 Admin Quotation section
  - Quoted Price: RM 2,675.00
  - Response/Notes from provider
  - Quoted date

**Customer Options:**

#### **Option A: Accept Quotation** ✓
**Action:** Click "✓ Accept Quotation"  
**Confirmation:** "Accept this quotation and proceed to order?"  
**Result:**
- Status: `quoted` → `accepted`
- Quotation moves to "Accepted" tab
- "✓ Quotation accepted! Proceed to place your order." message shows
- "🛒 Proceed to Checkout" button appears

**Updated Record:**
```javascript
{
  status: "accepted",
  // All other fields remain same
}
```

#### **Option B: Reject Quotation** ✗
**Action:** Click "✗ Reject"  
**Confirmation:** "Are you sure you want to reject this quotation?"  
**Result:**
- Status: `quoted` → `rejected`
- Quotation archived
- Customer can submit new request if needed

---

### **STEP 5: Customer Proceeds to Order**

**From:** Accepted Quotation Card  
**Action:** Click "🛒 Proceed to Checkout"

**System Process:**
1. Clears existing cart
2. Adds quotation as cart item:
   ```javascript
   {
     id: packageId,
     name: packageName,
     price: quotedPrice / numberOfGuests, // Price per pax
     quantity: numberOfGuests,
     category: 'package',
     quotationId: quotationId
   }
   ```
3. Pre-fills event details:
   - Event Date
   - Event Time
   - Event Location
   - Special Requirements
4. Redirects to `/checkout`

---

### **STEP 6: Customer Completes Order**

**Checkout Page:**
- Order Summary shows quotation items
- Event details pre-filled
- Customer reviews and confirms
- Submits order

**Order Created:**
```javascript
{
  userId: "customer_id",
  items: [...],
  totalAmount: 2675.00,
  eventDate: "2026-02-15",
  eventTime: "18:00",
  eventLocation: "Grand Ballroom, KL",
  specialRequirements: "Halal food required...",
  quotationId: "quotation_id", // Link to original quotation
  status: "pending",
  createdAt: "2026-01-16T15:00:00Z"
}
```

---

## 📊 Quotation Status Flow

```
CUSTOMER SUBMITS
    ↓
┌─────────────┐
│   PENDING   │ ← Waiting for provider review
└─────────────┘
    ↓ Provider reviews
┌─────────────┐
│   QUOTED    │ ← Provider sent price & details
└─────────────┘
    ↓ Customer decides
    ├──────────────────┬──────────────────┐
    ↓                  ↓                  ↓
┌─────────────┐   ┌──────────┐   ┌──────────┐
│  ACCEPTED   │   │ REJECTED │   │ (timeout) │
└─────────────┘   └──────────┘   └──────────┘
    ↓
🛒 PROCEED TO CHECKOUT
    ↓
📦 ORDER PLACED
```

---

## 🎯 User Journeys

### **Customer Journey**
1. Login → Dashboard
2. Navigate to "My Quotations"
3. Click "➕ New Request"
4. Fill event details & requirements
5. Submit request
6. Wait for provider response (1-2 business days)
7. Receive notification (check "Quoted" tab)
8. Review quoted price & details
9. Accept or reject quotation
10. If accepted: Proceed to checkout
11. Complete order placement

### **Provider Journey**
1. Login → Provider Dashboard
2. Navigate to "Quotations" section
3. View pending requests
4. Review customer requirements
5. Calculate pricing
6. Enter quoted amount & response notes
7. Send quotation to customer
8. Wait for customer decision
9. If accepted: Prepare order (moves to Orders page)
10. Fulfill order on event date

---

## 🔧 Technical Details

### **API Endpoints**

**Create Quotation:**
```
POST /api/quotations
Body: { customerName, email, phoneNumber, eventDate, eventTime, location, numberOfGuests, eventType, additionalRequests }
Auth: Required (Customer token)
Response: { message, quotation }
```

**Get My Quotations:**
```
GET /api/quotations/my-quotations
Auth: Required (Customer token)
Response: [quotations]
```

**Get All Quotations (Provider):**
```
GET /api/quotations
Auth: Required (Provider token)
Response: [quotations]
```

**Update Quotation (Provider):**
```
PUT /api/quotations/:id
Body: { status, quotedAmount, adminNotes }
Auth: Required (Provider token)
Response: { message, quotation }
```

**Accept Quotation:**
```
PUT /api/quotations/:id
Body: { status: 'accepted' }
Auth: Required (Customer token)
Response: { message, quotation }
```

**Reject Quotation:**
```
PUT /api/quotations/:id
Body: { status: 'rejected' }
Auth: Required (Customer token)
Response: { message, quotation }
```

---

### **Database Model**

**Quotation Schema:**
```javascript
{
  userId: ObjectId (ref: User),
  customerName: String (required),
  email: String (required),
  phoneNumber: String (required),
  eventDate: Date (required),
  eventTime: String,
  location: String,
  numberOfGuests: Number (required),
  eventType: String,
  additionalRequests: String,
  status: String (enum: ['pending', 'reviewed', 'quoted', 'accepted', 'rejected']),
  quotedAmount: Number (default: null),
  adminNotes: String (default: ''),
  quotedAt: Date,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

---

### **Frontend Components**

**Customer Side:**
- `src/views/Quotations.vue` - Main quotations page
  - New Request modal
  - Quotation list with status tabs
  - Accept/Reject actions
  - Proceed to checkout

**Provider Side:**
- `src/views/CateringProviderQuotations.vue` - Provider quotations management
  - Pending requests list
  - Quotation form (amount + notes)
  - Send quotation action

**Store:**
- `src/stores/quotations.js` - Pinia store
  - State: quotations list, loading, error
  - Actions: submitQuotation, fetchMyQuotations, updateQuotation, acceptQuotation, rejectQuotation

**API Service:**
- `src/services/api.js` - quotationAPI
  - createQuotation()
  - getMyQuotations()
  - getAllQuotations()
  - updateQuotation()

---

## 📝 Business Rules

1. **Minimum Advance Notice:** Events must be at least 1 day ahead
2. **Quotation Validity:** Quoted prices typically valid for 7-14 days
3. **Response Time:** Providers should respond within 1-2 business days
4. **Modification:** Once accepted, changes require new quotation
5. **Cancellation:** Rejected quotations cannot be reopened
6. **Order Link:** Accepted quotations auto-populate checkout

---

## ✅ Testing Checklist

### **Customer Tests**
- [ ] Can access quotations page
- [ ] Can open "New Request" modal
- [ ] Form validation works (required fields)
- [ ] Event date cannot be in past
- [ ] Form pre-fills user data
- [ ] Submission creates pending quotation
- [ ] Can view quotations in different tabs
- [ ] Can accept quoted quotation
- [ ] Can reject quoted quotation
- [ ] Proceed to checkout works
- [ ] Cart populates with quotation details

### **Provider Tests**
- [ ] Can view all quotations
- [ ] Can filter by status
- [ ] Can update quotation with price
- [ ] Can add response notes
- [ ] Quotation status updates correctly
- [ ] Customer receives updated quotation

### **Integration Tests**
- [ ] End-to-end: Submit → Quote → Accept → Order
- [ ] Multiple quotations per customer
- [ ] Quotation-to-order linking works
- [ ] Status transitions are correct

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot submit quotation"
**Cause:** Missing required fields or invalid date  
**Fix:** Ensure all * fields filled, event date is future

### Issue: "Quotation not appearing"
**Cause:** Wrong user ID or API fetch failure  
**Fix:** Check browser console, verify authentication token

### Issue: "Cannot accept quotation"
**Cause:** Quotation not in 'quoted' status  
**Fix:** Provider must send quotation first

### Issue: "Checkout not pre-filling"
**Cause:** quotationId not passed to cart  
**Fix:** Verify proceedToOrder() method adds quotationId

---

## 🚀 Future Enhancements

1. **Email Notifications:**
   - Customer receives email when quotation is sent
   - Provider receives email when quotation is accepted

2. **Quotation Comparison:**
   - Allow customers to request from multiple providers
   - Side-by-side comparison view

3. **Chat Feature:**
   - Real-time messaging for clarifications
   - Negotiation support

4. **Quotation History:**
   - Track all revisions
   - Version control

5. **Template Quotations:**
   - Save common packages
   - Quick quote generation

6. **Expiry Dates:**
   - Auto-set quotation validity period
   - Auto-reject after expiry

---

## 📞 Support

For quotation-related questions:
1. Check this workflow document
2. Review `src/views/Quotations.vue` code
3. Check backend `routes/quotation.js`
4. Verify database records in MongoDB
5. Test with seed accounts:
   - Customer: customer@example.com / customer123
   - Provider: provider@catering.com / provider123

---

**Last Updated:** January 16, 2026  
**Status:** ✅ FULLY FUNCTIONAL

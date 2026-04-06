# Package-Specific Food Items - Implementation Guide

## 🎯 Overview

Food items can now be assigned to specific packages. When a customer selects a package, they will only see rice and main dishes that belong to that package.

## ✨ What Was Added

### 1. Database Schema Update

**File**: `backend/models/Menu.js`

Added `packageIds` field to FoodItem schema:
```javascript
packageIds: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: 'Package',
  default: []
}
```

**Key Features:**
- Array of package IDs (a food item can belong to multiple packages)
- References the Package model
- Defaults to empty array if not specified

### 2. Provider Menu Management UI

**File**: `src/views/CateringProviderMenu.vue`

**New Features:**
- ✅ Multi-select checkbox list for package assignment
- ✅ Shows all provider's packages in the food item form
- ✅ Visual indication of selected packages
- ✅ Warning message if no packages exist
- ✅ Saves packageIds when creating/editing food items

**UI Location:**
When adding or editing a food item, you'll see:
```
Food Name: [input]
Category: [dropdown]
Available in Packages: ☑️ Package A (RM 15)
                       ☐ Package B (RM 25)
                       ☑️ Package C (RM 35)
Food Image: [file upload]
```

### 3. Customer Menu Filtering

**File**: `src/views/Menu.vue`

**Updated Logic:**
- `availableRice()` - Filters rice by selected package's ID
- `availableMainDishes()` - Filters main dishes by selected package's ID

**How It Works:**
1. Customer selects a package
2. System checks which rice items have that package ID in their `packageIds` array
3. System checks which main dishes have that package ID in their `packageIds` array
4. Only matching items are displayed for selection

### 4. Migration Script

**File**: `backend/migrations/add-package-ids-to-foods.js`

**Purpose:** Assign packageIds to existing food items

**Strategy:**
- Groups foods by provider
- Assigns all provider's foods to ALL of that provider's packages
- Allows manual refinement later

## 📋 How to Use

### For Providers

#### Creating a New Food Item with Package Assignment:

1. **Login** as a Catering Provider
2. **Navigate** to Menu Management (`/provider/menu`)
3. **Click** "Foods" tab
4. **Click** "+ Add Food Item" button
5. **Fill in** the form:
   - Food Name (e.g., "Nasi Lemak")
   - Category (Rice/Main/Side/Dessert)
   - **Check packages** where this food should appear
   - Upload image (optional)
6. **Click** "Save Food Item"

#### Example Scenario:

**Provider A has 3 packages:**
- Basic Package (RM 10)
- Standard Package (RM 15)
- Premium Package (RM 20)

**Creating "Nasi Lemak" (Rice):**
- ☑️ Basic Package
- ☑️ Standard Package  
- ☑️ Premium Package
→ Appears in all packages

**Creating "Wagyu Beef" (Main Dish):**
- ☐ Basic Package
- ☐ Standard Package
- ☑️ Premium Package
→ Only appears in Premium Package

### For Customers

#### Selecting Food Items:

1. **Browse** packages on Menu page
2. **Select** a package (e.g., "Premium Package")
3. **See only** rice items assigned to Premium Package
4. **See only** main dishes assigned to Premium Package
5. **Customize** your selection (2 rice, 8 main dishes)
6. **Add to cart** or **Request quotation**

#### Example Flow:

**Customer selects "Basic Package":**
- Rice options: Nasi Lemak, White Rice, Fried Rice
- Main dish options: Chicken Curry, Fried Chicken, Beef Rendang

**Customer switches to "Premium Package":**
- Rice options: Nasi Lemak, White Rice, Fried Rice, Saffron Rice
- Main dish options: Chicken Curry, Fried Chicken, Beef Rendang, **Wagyu Beef**, Lobster Thermidor

## 🔧 Migration Steps

### Step 1: Run Provider Migration (If Not Done)

```bash
cd backend
node migrations/add-provider-to-menu.js
```

This ensures all menu items have `providerId`.

### Step 2: Run Package Assignment Migration

```bash
cd backend
node migrations/add-package-ids-to-foods.js
```

**What This Does:**
- Finds all food items without package assignments
- Groups them by provider
- Assigns each provider's foods to ALL their packages
- Shows summary of what was updated

**Expected Output:**
```
✅ Connected to MongoDB
📋 Found 45 food items without package assignments
👥 Processing food items for 2 provider(s)...

📦 Provider 673abc123def456...
   - 3 package(s) found
   - 20 food item(s) to assign
   ✅ Assigned all 20 food items to all 3 package(s)

📦 Provider 673xyz789ghi012...
   - 2 package(s) found
   - 25 food item(s) to assign
   ✅ Assigned all 25 food items to all 2 package(s)

✅ Migration completed successfully!
Summary:
- Total food items updated: 45
```

### Step 3: Refine Package Assignments (Optional)

After migration, all foods are assigned to ALL packages. You may want to refine this:

1. Login as provider
2. Go to Menu Management → Foods tab
3. Click "Edit" on a food item
4. **Uncheck packages** where this food shouldn't appear
5. Save changes

**Example Refinement:**
- "Lobster Thermidor" → Uncheck Basic and Standard, keep only Premium
- "Simple Fried Rice" → Keep in all packages

## 🧪 Testing Checklist

### Provider Side:
- [ ] Create a new package (e.g., "Test Package")
- [ ] Create a new food item
- [ ] Verify package checkboxes appear in food form
- [ ] Check multiple packages and save
- [ ] Edit the food item and verify selected packages are checked
- [ ] Uncheck some packages and save
- [ ] Verify changes are persisted

### Customer Side:
- [ ] Go to Menu page
- [ ] Select first package
- [ ] Note which rice and main dishes appear
- [ ] Select different package
- [ ] Verify rice and main dishes change based on package
- [ ] Food items should only appear if assigned to selected package

### Edge Cases:
- [ ] Food item with NO packages selected → Won't appear in any package
- [ ] Food item assigned to Package A only → Appears when Package A is selected, hidden for others
- [ ] Food item assigned to ALL packages → Always visible regardless of package

## 📊 Database Structure

### Before (Old):
```javascript
{
  _id: "food123",
  name: "Nasi Lemak",
  category: "rice",
  providerId: "provider456",
  available: true
}
```

### After (New):
```javascript
{
  _id: "food123",
  name: "Nasi Lemak",
  category: "rice",
  providerId: "provider456",
  packageIds: ["pkg1", "pkg2", "pkg3"],  // ← NEW!
  available: true
}
```

## 🎨 UI Screenshot Description

### Provider Add Food Modal:
```
┌─────────────────────────────────────────┐
│  Add New Food Item                   × │
├─────────────────────────────────────────┤
│                                          │
│  Food Name *                             │
│  [Nasi Lemak________________]           │
│                                          │
│  Category *                              │
│  [Rice ▼]                               │
│                                          │
│  Available in Packages *                 │
│  ┌────────────────────────────────────┐ │
│  │ ☑️ Basic Package (RM 10)           │ │
│  │ ☑️ Standard Package (RM 15)        │ │
│  │ ☑️ Premium Package (RM 20)         │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Food Image                              │
│  [Choose File] No file chosen            │
│                                          │
│  [Save Food Item]                        │
└─────────────────────────────────────────┘
```

## 🔍 Troubleshooting

### Food items don't appear for customer

**Problem:** Customer selects package but no rice/main dishes show up

**Solutions:**
1. Check if food items have `packageIds` assigned
2. Run migration: `node migrations/add-package-ids-to-foods.js`
3. Verify food item's `packageIds` array includes the selected package's ID
4. Check if food items are set to `available: true`

### All foods appear regardless of package

**Problem:** Customer sees all foods for any package selected

**Possible Causes:**
1. Food items have empty `packageIds` array
2. Frontend filtering logic not working
3. Package ID mismatch (using `id` vs `_id`)

**Solution:**
- Check browser console for errors
- Verify `selectedPackage._id` exists
- Ensure food items have proper `packageIds` array

### Provider can't see package checkboxes

**Problem:** Adding food item but no packages listed

**Cause:** Provider hasn't created any packages yet

**Solution:**
1. Go to "Packages" tab first
2. Create at least one package
3. Return to "Foods" tab
4. Package checkboxes will now appear

### Migration script shows "0 food items updated"

**Cause:** All food items already have `packageIds` assigned

**This is normal** if you've run the migration before.

## 🚀 Advanced Usage

### Assigning Food to Specific Packages Only

**Scenario:** "Lobster Thermidor" should only appear in Premium and Deluxe packages

**Steps:**
1. Edit "Lobster Thermidor"
2. Uncheck: Basic Package
3. Uncheck: Standard Package
4. Check: Premium Package
5. Check: Deluxe Package
6. Save

**Result:** Customers selecting Basic or Standard won't see Lobster Thermidor

### Creating Package Tiers

**Example Strategy:**

**Basic Package Items:**
- Simple rice options
- Basic main dishes
- Standard sides

**Premium Package Items:**
- All Basic items +
- Specialty rice (Saffron, Briyani)
- Premium main dishes (Wagyu, Lobster)
- Gourmet sides

**Implementation:**
- Assign basic items to ALL packages
- Assign premium items to PREMIUM packages only

## 📝 Best Practices

1. **Create Packages First** - Before adding food items, set up your packages
2. **Assign to All by Default** - Start by assigning foods to all packages, then refine
3. **Test Both Views** - Always test from both provider and customer perspectives
4. **Clear Naming** - Use descriptive package names (Basic, Standard, Premium, etc.)
5. **Regular Review** - Periodically review which foods belong to which packages

## ✅ Success Criteria

- ✅ Provider can select multiple packages when creating food items
- ✅ Food item shows checked packages when editing
- ✅ Customer sees only package-specific foods
- ✅ Switching packages updates available food list
- ✅ Migration successfully assigns packageIds to existing foods

## 🎉 Summary

You've successfully implemented package-specific food filtering! Now:

- **Providers** can control which foods appear in which packages
- **Customers** see curated food selections based on their chosen package
- **System** maintains provider isolation and package-specific offerings

This creates a more professional and organized menu system where package tiers have distinct offerings! 🍱

---

**Status**: ✅ **FULLY IMPLEMENTED**
**Migration Required**: YES (run both migration scripts)
**Backward Compatible**: YES (packageIds defaults to empty array)

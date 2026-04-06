# Provider Menu Isolation - Migration Guide

## Overview
This update separates menu items (packages and food items) by provider. Each catering provider will now have their own isolated menu that customers can select from.

## What Changed

### Database Schema
- **Package Model**: Added `providerId` field (required)
- **FoodItem Model**: Added `providerId` field (required)

### Backend Changes
- All package/food creation now automatically sets `providerId` from authenticated user
- GET endpoints support `?providerId=xxx` query parameter
- UPDATE/DELETE endpoints enforce provider ownership (403 if trying to modify another provider's items)

### Frontend Changes
- **Customer Menu**: When selecting a package, only that provider's food items are shown
- **Provider Menu Management**: Providers only see and manage their own packages and food items
- Menu store supports provider-specific fetching

## Migration Required ✅

**IMPORTANT**: Existing menu items in your database don't have `providerId` yet. You must run the migration script before the system will work properly.

### Step 1: Run Migration Script

```bash
cd backend
node migrations/add-provider-to-menu.js
```

This script will:
1. Find all packages and food items without `providerId`
2. Assign them to the first available catering provider
3. Display a summary of changes

### Step 2: Verify Migration

After running the migration:
1. Check that all menu items are assigned to a provider
2. Login as different providers and verify they can only see their own items
3. Test customer menu selection with different provider packages

## Manual Assignment (Optional)

If you want to manually assign existing items to specific providers:

```javascript
// In MongoDB Compass or shell
db.packages.updateMany(
  { name: "Premium Package" },
  { $set: { providerId: ObjectId("provider_id_here") }}
)

db.fooditems.updateMany(
  { category: "rice" },
  { $set: { providerId: ObjectId("provider_id_here") }}
)
```

## Testing

### Test Provider Isolation

1. **Login as Provider A**
   - Go to Menu Management
   - Add a package (e.g., "Provider A Package")
   - Add food items (e.g., "Provider A Special Rice")

2. **Login as Provider B**
   - Go to Menu Management
   - Verify you DON'T see Provider A's items
   - Add your own package and food items

3. **Login as Customer**
   - Go to Menu page
   - Select Provider A's package
   - Verify only Provider A's food items appear
   - Go back and select Provider B's package
   - Verify only Provider B's food items appear

### Expected Behavior

✅ **Providers**: Can only see/edit/delete their own packages and food items
✅ **Customers**: See provider-specific food items based on selected package
✅ **API**: Returns 403 if provider tries to modify another provider's items
✅ **Database**: All packages and food items have valid providerId references

## Troubleshooting

### Error: "providerId is required"
- Run the migration script to add providerId to existing items
- Ensure you're logged in as a catering provider when creating items

### Empty menu in provider dashboard
- Check if the provider has created any packages/food items
- Verify authStore.user.id is available in mounted hook
- Check browser console for API errors

### Customer sees all providers' food items
- Ensure package has providerId field
- Verify Menu.vue calls `fetchFoods(pkg.providerId)` in selectPackage method
- Check backend GET /foods route includes providerId query parameter

### 403 Forbidden when editing menu items
- Verify you're logged in as the correct provider
- Check that the item's providerId matches your user ID
- Review backend middleware authentication

## Rollback (Emergency Only)

If you need to rollback:

1. **Remove providerId requirement** (temporary):
```javascript
// In backend/models/Menu.js
providerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: false  // Change to false temporarily
}
```

2. **Restart backend**

3. **Fix data issues**

4. **Re-run migration**

5. **Change back to required: true**

## Next Steps

After successful migration:
1. ✅ Test with multiple providers
2. ✅ Verify customer menu selection works correctly
3. ✅ Train providers on the new isolated menu system
4. Consider adding provider branding/logos to menu items
5. Consider adding analytics to track provider-specific sales

## Support

If you encounter issues:
1. Check migration script output for errors
2. Verify MongoDB connection string in .env
3. Ensure at least one provider exists before migration
4. Review browser console and backend logs for errors

---

**Migration Status**: Required for all existing deployments
**Database Changes**: Non-destructive (adds fields only)
**Backward Compatibility**: None - migration is mandatory

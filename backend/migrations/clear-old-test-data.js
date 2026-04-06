import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Package, FoodItem } from '../models/Menu.js';

dotenv.config();

/**
 * Clear Old Test Data Script
 * 
 * This script removes old test packages and food items that don't have providerId.
 * Run this to clean up the old hardcoded test data.
 */

async function clearOldTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('');

    // Find packages without providerId
    const packagesWithoutProvider = await Package.find({ 
      providerId: { $exists: false } 
    });
    
    console.log(`📦 Found ${packagesWithoutProvider.length} packages without providerId:`);
    packagesWithoutProvider.forEach(pkg => {
      console.log(`   - ${pkg.name} (RM ${pkg.price})`);
    });
    console.log('');

    // Find food items without providerId
    const foodsWithoutProvider = await FoodItem.find({ 
      providerId: { $exists: false } 
    });
    
    console.log(`🍽️  Found ${foodsWithoutProvider.length} food items without providerId:`);
    foodsWithoutProvider.forEach(food => {
      console.log(`   - ${food.name} (${food.category})`);
    });
    console.log('');

    if (packagesWithoutProvider.length === 0 && foodsWithoutProvider.length === 0) {
      console.log('✅ No old test data found. Database is clean!');
      return;
    }

    // Delete packages without providerId
    if (packagesWithoutProvider.length > 0) {
      const pkgResult = await Package.deleteMany({ 
        providerId: { $exists: false } 
      });
      console.log(`✅ Deleted ${pkgResult.deletedCount} old packages`);
    }

    // Delete food items without providerId
    if (foodsWithoutProvider.length > 0) {
      const foodResult = await FoodItem.deleteMany({ 
        providerId: { $exists: false } 
      });
      console.log(`✅ Deleted ${foodResult.deletedCount} old food items`);
    }

    console.log('');
    console.log('🎉 Old test data cleared successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Login as a provider (provider@catering.com / provider123)');
    console.log('2. Go to Menu Management (/provider/menu)');
    console.log('3. Create your own packages and food items');
    console.log('4. Customers will now see only provider-created menus');

  } catch (error) {
    console.error('❌ Error clearing test data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('');
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run script
console.log('');
console.log('='.repeat(60));
console.log('  CLEAR OLD TEST DATA');
console.log('='.repeat(60));
console.log('');
console.log('This will remove old hardcoded packages and food items.');
console.log('Only items WITHOUT providerId will be deleted.');
console.log('');

clearOldTestData();

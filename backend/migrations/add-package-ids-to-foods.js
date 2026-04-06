import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { FoodItem, Package } from '../models/Menu.js';

dotenv.config();

/**
 * Migration Script: Add packageIds to existing food items
 * 
 * This script will:
 * 1. Find all existing food items
 * 2. For each provider, assign all their food items to all their packages
 * 3. Alternatively, you can manually assign specific foods to specific packages later
 */

async function migrateFoodPackageIds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all food items without packageIds
    const foodsWithoutPackages = await FoodItem.find({ 
      $or: [
        { packageIds: { $exists: false } },
        { packageIds: { $size: 0 } }
      ]
    });

    console.log(`📋 Found ${foodsWithoutPackages.length} food items without package assignments`);
    
    if (foodsWithoutPackages.length === 0) {
      console.log('✅ All food items already have package assignments!');
      return;
    }

    console.log('');

    // Group foods by provider
    const foodsByProvider = {};
    for (const food of foodsWithoutPackages) {
      const providerId = food.providerId.toString();
      if (!foodsByProvider[providerId]) {
        foodsByProvider[providerId] = [];
      }
      foodsByProvider[providerId].push(food);
    }

    console.log(`👥 Processing food items for ${Object.keys(foodsByProvider).length} provider(s)...`);
    console.log('');

    let totalUpdated = 0;

    // For each provider, assign their foods to all their packages
    for (const [providerId, foods] of Object.entries(foodsByProvider)) {
      // Get all packages for this provider
      const providerPackages = await Package.find({ providerId });

      if (providerPackages.length === 0) {
        console.log(`⚠️  Provider ${providerId} has ${foods.length} food items but NO packages`);
        console.log(`   These foods will remain unassigned until packages are created.`);
        console.log('');
        continue;
      }

      const packageIds = providerPackages.map(pkg => pkg._id);
      console.log(`📦 Provider ${providerId}:`);
      console.log(`   - ${providerPackages.length} package(s) found`);
      console.log(`   - ${foods.length} food item(s) to assign`);

      // Update all foods for this provider
      for (const food of foods) {
        await FoodItem.findByIdAndUpdate(
          food._id,
          { $set: { packageIds: packageIds } }
        );
        totalUpdated++;
      }

      console.log(`   ✅ Assigned all ${foods.length} food items to all ${providerPackages.length} package(s)`);
      console.log('');
    }

    console.log('='.repeat(60));
    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Summary:');
    console.log(`- Total food items updated: ${totalUpdated}`);
    console.log(`- Each food item is now assigned to ALL packages from the same provider`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Login as a provider and go to Menu Management');
    console.log('2. Edit each food item to select specific packages (optional)');
    console.log('3. Test customer menu to verify foods appear for selected packages');
    console.log('');
    console.log('Note: You can manually adjust package assignments per food item');
    console.log('      by editing the food item in the provider menu management page.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('');
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run migration
console.log('');
console.log('='.repeat(60));
console.log('  FOOD PACKAGE ASSIGNMENT MIGRATION');
console.log('='.repeat(60));
console.log('');
console.log('This script will assign food items to packages.');
console.log('Strategy: Each provider\'s food items → ALL of that provider\'s packages');
console.log('');

migrateFoodPackageIds();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Package, FoodItem } from '../models/Menu.js';
import User from '../models/User.js';

dotenv.config();

/**
 * Migration Script: Add providerId to existing menu items
 * 
 * This script will:
 * 1. Find all existing packages and food items without providerId
 * 2. Assign them to the first available catering provider
 * 3. Or create a default provider if none exists
 */

async function migrateMenuItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find a catering provider to assign existing items to
    let provider = await User.findOne({ role: 'cateringProvider', approvalStatus: 'approved' });
    
    if (!provider) {
      console.log('⚠️  No approved provider found. Looking for any provider...');
      provider = await User.findOne({ role: 'cateringProvider' });
    }

    if (!provider) {
      console.log('❌ No catering provider found in the database.');
      console.log('Please create a provider account first or the migration will fail.');
      console.log('');
      console.log('Exiting without making changes.');
      process.exit(1);
    }

    console.log(`✅ Found provider: ${provider.businessName || provider.username} (${provider.email})`);
    console.log(`   Provider ID: ${provider._id}`);
    console.log('');

    // Update packages without providerId
    const packagesWithoutProvider = await Package.find({ providerId: { $exists: false } });
    console.log(`📦 Found ${packagesWithoutProvider.length} packages without providerId`);

    if (packagesWithoutProvider.length > 0) {
      const packageResult = await Package.updateMany(
        { providerId: { $exists: false } },
        { $set: { providerId: provider._id } }
      );
      console.log(`   ✅ Updated ${packageResult.modifiedCount} packages`);
    }

    // Update food items without providerId
    const foodsWithoutProvider = await FoodItem.find({ providerId: { $exists: false } });
    console.log(`🍱 Found ${foodsWithoutProvider.length} food items without providerId`);

    if (foodsWithoutProvider.length > 0) {
      const foodResult = await FoodItem.updateMany(
        { providerId: { $exists: false } },
        { $set: { providerId: provider._id } }
      );
      console.log(`   ✅ Updated ${foodResult.modifiedCount} food items`);
    }

    console.log('');
    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Summary:');
    console.log(`- All existing menu items are now assigned to: ${provider.businessName || provider.username}`);
    console.log(`- Packages updated: ${packagesWithoutProvider.length}`);
    console.log(`- Food items updated: ${foodsWithoutProvider.length}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test that providers can only see their own menu items');
    console.log('3. Create menu items for other providers as needed');

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
console.log('  MENU ITEMS PROVIDER MIGRATION');
console.log('='.repeat(60));
console.log('');
console.log('This script will add providerId to all existing packages and food items.');
console.log('');

migrateMenuItems();

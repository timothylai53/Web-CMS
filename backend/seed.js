import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import { Package, FoodItem } from './models/Menu.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Package.deleteMany({});
    await FoodItem.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create super admin user
    const superadmin = new User({
      username: 'superadmin',
      email: 'superadmin@catering.com',
      password: 'superadmin123',
      fullName: 'System Administrator',
      phone: '012-3456789',
      address: 'Admin Office, KL',
      role: 'superadmin',
      isActive: true,
      approvalStatus: 'approved'
    });
    await superadmin.save();
    console.log('👤 Super Admin created (email: superadmin@catering.com, password: superadmin123)');

    // Create catering provider user (approved)
    const provider = new User({
      username: 'provider',
      email: 'provider@catering.com',
      password: 'provider123',
      fullName: 'John Caterer',
      phone: '012-9876543',
      address: '123 Catering Street, KL',
      role: 'cateringProvider',
      businessName: 'Delicious Catering Services',
      approvalStatus: 'approved',
      isActive: true
    });
    await provider.save();
    console.log('👤 Catering Provider created (email: provider@catering.com, password: provider123)');

    // Create sample customer
    const customer = new User({
      username: 'customer',
      email: 'customer@example.com',
      password: 'customer123',
      fullName: 'Jane Customer',
      phone: '012-1234567',
      address: '456 Customer Avenue, KL',
      role: 'customer',
      approvalStatus: 'approved',
      isActive: true
    });
    await customer.save();
    console.log('👤 Customer user created (email: customer@example.com, password: customer123)');

    // Note: Packages and food items should be created by providers through the UI
    // This ensures they are properly assigned with providerId
    console.log('📝 Note: Providers can create packages and food items through Menu Management');

    console.log('\n✨ Database seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('Super Admin - email: superadmin@catering.com, password: superadmin123');
    console.log('Catering Provider - email: provider@catering.com, password: provider123');
    console.log('Customer - email: customer@example.com, password: customer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

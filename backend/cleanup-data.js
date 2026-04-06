import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

// Import models
import User from './models/User.js';
import { Package, FoodItem } from './models/Menu.js';
import Order from './models/Order.js';
import Quotation from './models/Quotation.js';
import PackList from './models/PackList.js';
import InventoryItem from './models/InventoryItem.js';

dotenv.config();

async function cleanupDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🗑️  Database Cleanup Options:');
    console.log('1. Clear ALL orders');
    console.log('2. Clear ALL quotations');
    console.log('3. Clear ALL menus/packages');
    console.log('4. Clear ALL users (except super admin)');
    console.log('5. Clear EVERYTHING (reset database)');
    console.log('6. Clear orders from a specific provider');
    console.log('7. Clear inventory items');
    console.log('8. Exit');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('\nEnter your choice (1-8): ', async (choice) => {
      try {
        switch (choice) {
          case '1':
            await Order.deleteMany({});
            console.log('✅ All orders deleted');
            break;

          case '2':
            await Quotation.deleteMany({});
            console.log('✅ All quotations deleted');
            break;

          case '3':
            await Package.deleteMany({});
            await FoodItem.deleteMany({});
            await PackList.deleteMany({});
            console.log('✅ All packages, food items, and pack lists deleted');
            break;

          case '4':
            const result = await User.deleteMany({ role: { $ne: 'superadmin' } });
            console.log(`✅ Deleted ${result.deletedCount} users (kept super admin)`);
            break;

          case '5':
            await Order.deleteMany({});
            await Quotation.deleteMany({});
            await Package.deleteMany({});
            await FoodItem.deleteMany({});
            await PackList.deleteMany({});
            await InventoryItem.deleteMany({});
            await User.deleteMany({ role: { $ne: 'superadmin' } });
            console.log('✅ Database reset complete (kept super admin)');
            break;

          case '6':
            const providers = await User.find({ role: 'cateringProvider' }).select('_id email businessName');
            console.log('\nAvailable Providers:');
            providers.forEach((p, i) => {
              console.log(`${i + 1}. ${p.businessName || p.email} (ID: ${p._id})`);
            });
            
            rl.question('\nEnter provider number: ', async (num) => {
              const provider = providers[parseInt(num) - 1];
              if (provider) {
                const orderResult = await Order.deleteMany({ providerId: provider._id });
                console.log(`✅ Deleted ${orderResult.deletedCount} orders from ${provider.businessName || provider.email}`);
              } else {
                console.log('❌ Invalid provider number');
              }
              rl.close();
              await mongoose.connection.close();
              process.exit(0);
            });
            return; // Don't close connection yet

          case '7':
            await InventoryItem.deleteMany({});
            console.log('✅ All inventory items deleted');
            break;

          case '8':
            console.log('👋 Exiting without changes');
            break;

          default:
            console.log('❌ Invalid choice');
        }

        rl.close();
        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);

      } catch (error) {
        console.error('❌ Error:', error.message);
        rl.close();
        await mongoose.connection.close();
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
}

// Alternative: Clear specific data directly (uncomment what you need)

async function clearOrders() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Order.deleteMany({});
  console.log('✅ All orders cleared');
  await mongoose.connection.close();
}

async function clearQuotations() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Quotation.deleteMany({});
  console.log('✅ All quotations cleared');
  await mongoose.connection.close();
}

async function clearTestUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({ 
    email: { 
      $in: ['customer@example.com', 'provider@catering.com'] 
    } 
  });
  console.log('✅ Test users cleared');
  await mongoose.connection.close();
}

// Run the interactive cleanup
cleanupDatabase();

// Or run specific cleanup (uncomment to use):
// clearOrders();
// clearQuotations();
// clearTestUsers();

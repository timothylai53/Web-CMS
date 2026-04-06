import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import { Package } from './models/Menu.js';

dotenv.config();

async function checkPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({ role: 'cateringProvider' }).select('_id businessName email');
    console.log('\n=== PROVIDERS ===');
    users.forEach(u => {
      console.log(`${u._id} - ${u.businessName} (${u.email})`);
    });

    const packages = await Package.find().populate('providerId', 'businessName email');
    console.log('\n=== PACKAGES ===');
    packages.forEach(p => {
      console.log(`${p._id} - ${p.name} - Provider: ${p.providerId?.businessName || 'NONE'} (${p.providerId?._id || 'NO ID'})`);
    });

    await mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPackages();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Model
 * Purpose: Stores user authentication and profile data
 * Roles:
 *  - customer: Regular customers who order catering services
 *  - cateringProvider: Catering service providers (pending/approved)
 *  - superadmin: System administrators who manage the platform
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['customer', 'cateringProvider', 'superadmin'],
    default: 'customer'
  },
  // Catering Provider specific fields
  businessName: {
    type: String,
    default: ''
  },
  // Provider Documents (Base64 encoded files)
  businessRegistration: {
    type: String,
    default: null
  },
  foodLicense: {
    type: String,
    default: null
  },
  bankStatement: {
    type: String,
    default: null
  },
  halalCertificate: {
    type: String,
    default: null
  },
  
  // Profile Fields - Brand Identity
  logo: {
    type: String,
    default: null
  },
  banner: {
    type: String,
    default: null
  },
  aboutUs: {
    type: String,
    default: ''
  },
  gallery: {
    type: [String],
    default: []
  },
  
  // Profile Fields - Operations
  serviceAreaType: {
    type: String,
    enum: ['radius', 'specific'],
    default: 'radius'
  },
  deliveryRadius: {
    type: Number,
    default: 50
  },
  serviceLocations: {
    type: [String],
    default: []
  },
  leadTimeDays: {
    type: Number,
    default: 3
  },
  minimumOrderValue: {
    type: Number,
    default: 500
  },
  operatingDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  operatingHours: {
    type: Object,
    default: {
      Monday: { open: '09:00', close: '18:00' },
      Tuesday: { open: '09:00', close: '18:00' },
      Wednesday: { open: '09:00', close: '18:00' },
      Thursday: { open: '09:00', close: '18:00' },
      Friday: { open: '09:00', close: '18:00' },
      Saturday: { open: '09:00', close: '18:00' },
      Sunday: { open: '09:00', close: '18:00' }
    }
  },
  
  // Profile Fields - Financial
  bankAccount: {
    type: String,
    default: ''
  },
  bankName: {
    type: String,
    default: ''
  },
  accountHolderName: {
    type: String,
    default: ''
  },
  notifications: {
    type: Object,
    default: {
      email: true,
      sms: false,
      dashboard: true
    }
  },
  
  // Pending Approval Fields (for sensitive changes)
  businessNamePending: {
    type: Boolean,
    default: false
  },
  pendingBusinessName: {
    type: String,
    default: null
  },
  bankAccountPending: {
    type: Boolean,
    default: false
  },
  pendingBankAccount: {
    type: String,
    default: null
  },
  businessRegistrationPending: {
    type: Boolean,
    default: false
  },
  pendingBusinessRegistration: {
    type: String,
    default: null
  },
  foodLicensePending: {
    type: Boolean,
    default: false
  },
  pendingFoodLicense: {
    type: String,
    default: null
  },
  bankStatementPending: {
    type: Boolean,
    default: false
  },
  pendingBankStatement: {
    type: String,
    default: null
  },
  halalCertificatePending: {
    type: Boolean,
    default: false
  },
  pendingHalalCertificate: {
    type: String,
    default: null
  },
  
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      return this.role === 'cateringProvider' ? 'pending' : 'approved';
    }
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);

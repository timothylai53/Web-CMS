import mongoose from 'mongoose';

const equipmentMovementSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['checked-out', 'checked-in', 'damaged', 'lost'],
    default: 'checked-out'
  },
  damageDescription: String,
  damagePhotos: [String],
  replacementCost: Number
}, { _id: false });

const packListSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    index: true
  },
  
  // Event Details
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventLocation: {
    type: String,
    required: true
  },
  guestCount: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Equipment List
  equipment: [equipmentMovementSchema],
  
  // Staff Assignment
  assignedStaff: [{
    name: String,
    role: String,
    contact: String
  }],
  
  // Timeline
  packingDeadline: Date,
  transportTime: Date,
  setupTime: Date,
  eventStartTime: Date,
  eventEndTime: Date,
  teardownTime: Date,
  returnTime: Date,
  
  // Check-out Details
  checkedOutAt: Date,
  checkedOutBy: {
    name: String,
    signature: String // Base64 signature image
  },
  checkoutNotes: String,
  checkoutPhotos: [String], // Base64 images
  
  // Check-in Details
  checkedInAt: Date,
  checkedInBy: {
    name: String,
    signature: String
  },
  checkinNotes: String,
  checkinPhotos: [String],
  
  // Status Tracking
  status: {
    type: String,
    enum: ['draft', 'ready-to-pack', 'packed', 'checked-out', 'in-transit', 'on-site', 'completed', 'checked-in', 'cancelled'],
    default: 'draft'
  },
  
  // Damage & Loss Report
  damageReport: {
    hasDamage: {
      type: Boolean,
      default: false
    },
    items: [{
      equipmentId: mongoose.Schema.Types.ObjectId,
      equipmentName: String,
      quantity: Number,
      issueType: {
        type: String,
        enum: ['damaged', 'lost', 'broken']
      },
      description: String,
      photos: [String],
      estimatedCost: Number,
      reportedBy: String,
      reportedAt: Date
    }]
  },
  
  // Financial Impact
  equipmentValue: {
    type: Number,
    default: 0
  },
  damageCharges: {
    type: Number,
    default: 0
  },
  lossCharges: {
    type: Number,
    default: 0
  },
  clientBilled: {
    type: Boolean,
    default: false
  },
  
  // Notes
  specialInstructions: String,
  internalNotes: String
}, {
  timestamps: true
});

// Indexes
packListSchema.index({ providerId: 1, status: 1 });
packListSchema.index({ eventDate: 1 });
packListSchema.index({ status: 1 });

// Pre-save hook to calculate equipment value
packListSchema.pre('save', function(next) {
  if (this.equipment && this.equipment.length > 0) {
    // This is a simplified calculation
    // In a real system, you'd fetch actual equipment costs from InventoryItem
    this.equipmentValue = this.equipment.reduce((total, item) => {
      return total + (item.quantity * 100); // Placeholder: 100 per item
    }, 0);
  }
  next();
});

const PackList = mongoose.model('PackList', packListSchema);

export default PackList;

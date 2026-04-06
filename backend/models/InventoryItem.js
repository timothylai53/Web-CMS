import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  itemType: {
    type: String,
    enum: ['consumable', 'equipment'],
    required: true
  },
  // Basic Information
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      // Consumable Categories
      'Dry Goods', 'Chilled', 'Frozen', 'Fresh Produce', 'Spices & Condiments', 'Beverages',
      // Equipment Categories
      'Cooking Equipment', 'Serving Ware', 'Dining Sets', 'Linens', 'Transport Equipment', 'Other Equipment'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  
  // Stock Management (for consumables)
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'liter', 'ml', 'pieces', 'boxes', 'bags', 'bunches', 'dozen', 'units'],
    default: 'kg'
  },
  reorderPoint: {
    type: Number,
    default: 0,
    min: 0
  },
  reorderQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  costPerUnit: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Expiration Tracking (for consumables)
  expirationDate: {
    type: Date
  },
  daysBeforeExpiryAlert: {
    type: Number,
    default: 7
  },
  
  // Equipment Tracking (for non-consumables)
  totalQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  availableQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  inUseQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  damagedQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  lostQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Supplier Information
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  
  // Storage Location
  storageLocation: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'low-stock', 'out-of-stock', 'expiring-soon', 'expired', 'inactive'],
    default: 'active'
  },
  
  // Notes
  notes: {
    type: String,
    trim: true
  },
  
  // Audit Trail
  lastRestocked: {
    type: Date
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
inventoryItemSchema.index({ providerId: 1, itemType: 1 });
inventoryItemSchema.index({ providerId: 1, category: 1 });
inventoryItemSchema.index({ providerId: 1, status: 1 });
inventoryItemSchema.index({ expirationDate: 1 });

// Virtual for checking if item is low on stock
inventoryItemSchema.virtual('isLowStock').get(function() {
  if (this.itemType === 'consumable') {
    return this.quantity <= this.reorderPoint && this.quantity > 0;
  }
  return false;
});

// Virtual for checking if item is expiring soon
inventoryItemSchema.virtual('isExpiringSoon').get(function() {
  if (this.itemType === 'consumable' && this.expirationDate) {
    const daysUntilExpiry = Math.ceil((this.expirationDate - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= this.daysBeforeExpiryAlert;
  }
  return false;
});

// Virtual for checking if item is expired
inventoryItemSchema.virtual('isExpired').get(function() {
  if (this.itemType === 'consumable' && this.expirationDate) {
    return this.expirationDate < new Date();
  }
  return false;
});

// Virtual for total value (consumables)
inventoryItemSchema.virtual('totalValue').get(function() {
  if (this.itemType === 'consumable') {
    return this.quantity * this.costPerUnit;
  }
  return 0;
});

// Pre-save hook to update status
inventoryItemSchema.pre('save', function(next) {
  if (this.itemType === 'consumable') {
    // Check expiration
    if (this.isExpired) {
      this.status = 'expired';
    } else if (this.isExpiringSoon) {
      this.status = 'expiring-soon';
    }
    // Check stock levels
    else if (this.quantity === 0) {
      this.status = 'out-of-stock';
    } else if (this.isLowStock) {
      this.status = 'low-stock';
    } else {
      this.status = 'active';
    }
  } else if (this.itemType === 'equipment') {
    if (this.totalQuantity === 0) {
      this.status = 'out-of-stock';
    } else if (this.availableQuantity === 0 && this.inUseQuantity > 0) {
      this.status = 'low-stock';
    } else {
      this.status = 'active';
    }
  }
  next();
});

// Enable virtuals in JSON
inventoryItemSchema.set('toJSON', { virtuals: true });
inventoryItemSchema.set('toObject', { virtuals: true });

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;

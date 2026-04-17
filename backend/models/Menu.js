import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  maxPax: {
    type: Number,
    default: 100
  },
  minPax: {
    type: Number,
    min: 1,
    default: 1
  },
  discountEnabled: {
    type: Boolean,
    default: false
  },
  discountMinPax: {
    type: Number,
    min: 2,
    default: null
  },
  discountedPrice: {
    type: Number,
    min: 0,
    default: null
  },
  category: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'deluxe'],
    default: 'basic'
  },
  image: {
    type: String,
    default: null
  },
  waitersAvailable: {
    type: Boolean,
    default: false
  },
  waiterQuantity: {
    type: Number,
    min: 0,
    default: 0
  },
  waiterFee: {
    type: Number,
    min: 0,
    default: 0
  },
  venueAvailable: {
    type: Boolean,
    default: false
  },
  venueFee: {
    type: Number,
    min: 0,
    default: 0
  },
  mainDishLimit: {
    type: Number,
    min: 1,
    default: 8
  },
  sideDishLimit: {
    type: Number,
    min: 1,
    default: 5
  },
  beverageLimit: {
    type: Number,
    min: 1,
    default: 3
  },
  dessertLimit: {
    type: Number,
    min: 1,
    default: 3
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['rice', 'main', 'side', 'drink', 'dessert'],
    required: true
  },
  image: {
    type: String,
    default: null
  },
  available: {
    type: Boolean,
    default: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Package',
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Package = mongoose.model('Package', packageSchema);
export const FoodItem = mongoose.model('FoodItem', foodItemSchema);

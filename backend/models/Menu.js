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
  category: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'deluxe'],
    default: 'basic'
  },
  image: {
    type: String,
    default: null
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

import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  quotationId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  customerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventTime: String,
  location: String,
  numberOfGuests: {
    type: Number,
    required: true
  },
  eventType: String,
  selectedFoods: [String],
  selectedDrinks: [String],
  selectedCakes: [String],
  additionalRequests: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'quoted', 'quotedEdited', 'accepted', 'rejected'],
    default: 'pending'
  },
  quotedAmount: {
    type: Number,
    default: null
  },
  adminNotes: {
    type: String,
    default: ''
  },
  quotationPdfUrl: {
    type: String,
    default: null
  },
  quotationPdfName: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

quotationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate quotationId if not exists
  if (!this.quotationId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.quotationId = `QR-${year}${month}${day}-${random}`;
  }
  
  next();
});

export default mongoose.model('Quotation', quotationSchema);

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Quotation from '../models/Quotation.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const quotationUploadsDir = path.join(__dirname, '..', 'uploads', 'quotations');
if (!fs.existsSync(quotationUploadsDir)) {
  fs.mkdirSync(quotationUploadsDir, { recursive: true });
}

const quotationPdfStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, quotationUploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `quotation-${uniqueSuffix}.pdf`);
  }
});

const quotationPdfFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = path.extname(file.originalname || '').toLowerCase() === '.pdf';
  if (isPdfMime || isPdfExt) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const uploadQuotationPdf = multer({
  storage: quotationPdfStorage,
  fileFilter: quotationPdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/upload-pdf', authenticate, isAdmin, uploadQuotationPdf.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    return res.status(201).json({
      message: 'Quotation PDF uploaded successfully',
      pdfPath: `/uploads/quotations/${req.file.filename}`,
      fileName: req.file.originalname || req.file.filename
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create quotation request
router.post('/', authenticate, async (req, res) => {
  try {
    const quotation = new Quotation({
      ...req.body,
      userId: req.user.userId
    });
    await quotation.save();
    
    const populatedQuotation = await Quotation.findById(quotation._id)
      .populate('userId', 'username email');
    
    res.status(201).json({ 
      message: 'Quotation request submitted successfully', 
      quotation: populatedQuotation 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's quotations
router.get('/my-quotations', authenticate, async (req, res) => {
  try {
    const quotations = await Quotation.find({ userId: req.user.userId })
      .populate('providerId', 'businessName email phone')
      .populate('packageId', 'name price')
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all quotations (Admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate('userId', 'username email')
      .populate('providerId', 'businessName email phone')
      .populate('packageId', 'name price')
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get quotation by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('providerId', 'businessName email phone')
      .populate('packageId', 'name price');
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // Check if user owns the quotation or is admin/provider
    if (quotation.userId._id.toString() !== req.user.userId && 
        !['admin', 'cateringProvider', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update quotation (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('userId', 'username email');

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json({ message: 'Quotation updated', quotation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Customer accepts quotation
router.put('/:id/accept', authenticate, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // Verify user owns this quotation
    if (quotation.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to accept this quotation' });
    }

    // Update status to accepted
    quotation.status = 'accepted';
    quotation.updatedAt = Date.now();
    await quotation.save();

    const updatedQuotation = await Quotation.findById(quotation._id)
      .populate('userId', 'username email')
      .populate('providerId', 'businessName email phone')
      .populate('packageId', 'name price');

    res.json({ message: 'Quotation accepted', quotation: updatedQuotation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Customer rejects quotation
router.put('/:id/reject', authenticate, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // Verify user owns this quotation
    if (quotation.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to reject this quotation' });
    }

    // Update status to rejected
    quotation.status = 'rejected';
    quotation.updatedAt = Date.now();
    await quotation.save();

    const updatedQuotation = await Quotation.findById(quotation._id)
      .populate('userId', 'username email')
      .populate('providerId', 'businessName email phone')
      .populate('packageId', 'name price');

    res.json({ message: 'Quotation rejected', quotation: updatedQuotation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete quotation (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json({ message: 'Quotation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

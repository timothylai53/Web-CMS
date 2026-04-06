import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { 
      username, email, password, role, fullName, phone, address, businessName,
      businessRegistration, foodLicense, bankStatement, halalCertificate 
    } = req.body;

    console.log('Registration attempt:', { 
      username, 
      email, 
      role, 
      hasDocs: !!(businessRegistration && foodLicense && bankStatement && halalCertificate)
    });

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with all fields
    const user = new User({
      username,
      email,
      password,
      fullName,
      phone,
      address,
      role: role || 'customer',
      businessName: businessName || '',
      businessRegistration: businessRegistration || null,
      foodLicense: foodLicense || null,
      bankStatement: bankStatement || null,
      halalCertificate: halalCertificate || null
    });

    await user.save();
    console.log('User saved successfully:', user._id);

    // Generate token (only for customers, providers need approval)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        businessName: user.businessName,
        approvalStatus: user.approvalStatus,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        role: user.role,
        businessName: user.businessName,
        approvalStatus: user.approvalStatus,
        rejectionReason: user.rejectionReason,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Get all approved catering providers
router.get('/providers', async (req, res) => {
  try {
    const providers = await User.find({ 
      role: 'cateringProvider',
      approvalStatus: 'approved',
      isActive: true
    }).select('_id businessName email createdAt');
    
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

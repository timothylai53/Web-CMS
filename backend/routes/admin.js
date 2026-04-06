import express from 'express';
import User from '../models/User.js';
import { authenticate, isSuperAdmin } from '../middleware/auth.js';

/**
 * Super Admin Routes
 * Purpose: System administration endpoints
 * Role: superadmin only
 * Functions:
 *  - Approve/reject catering provider applications
 *  - Manage all user accounts (activate/deactivate)
 *  - View system statistics
 *  - Manage system configuration
 */

const router = express.Router();

// Get all pending catering provider applications
router.get('/providers/pending', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const pendingProviders = await User.find({ 
      role: 'cateringProvider',
      approvalStatus: 'pending'
    }).select('-password').sort({ createdAt: -1 });
    
    res.json(pendingProviders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get approved catering providers (public for customers)
router.get('/providers/approved', authenticate, async (req, res) => {
  try {
    const providers = await User.find({ 
      role: 'cateringProvider',
      approvalStatus: 'approved',
      isActive: true
    })
    .select('-password -licenseDocument -businessRegistration -foodLicense -bankStatement -halalCertificate -gallery')
    .lean()
    .sort({ businessName: 1 });
    
    res.json(providers);
  } catch (error) {
    console.error('Error fetching approved providers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all catering providers (approved, pending, rejected)
router.get('/providers', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const providers = await User.find({ 
      role: 'cateringProvider'
    }).select('-password').sort({ createdAt: -1 });
    
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve catering provider application
router.put('/providers/:id/approve', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user || user.role !== 'cateringProvider') {
      return res.status(404).json({ message: 'Catering provider not found' });
    }

    user.approvalStatus = 'approved';
    user.isActive = true;
    user.rejectionReason = '';
    await user.save();

    res.json({ 
      message: 'Catering provider approved successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        businessName: user.businessName,
        approvalStatus: user.approvalStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject catering provider application
router.put('/providers/:id/reject', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user || user.role !== 'cateringProvider') {
      return res.status(404).json({ message: 'Catering provider not found' });
    }

    user.approvalStatus = 'rejected';
    user.rejectionReason = reason || 'Application does not meet requirements';
    await user.save();

    res.json({ 
      message: 'Catering provider application rejected',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        businessName: user.businessName,
        approvalStatus: user.approvalStatus,
        rejectionReason: user.rejectionReason
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all customers
router.get('/customers', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const customers = await User.find({ 
      role: 'customer'
    }).select('-password').sort({ createdAt: -1 });
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (customers + providers)
router.get('/users', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const users = await User.find({ 
      role: { $in: ['customer', 'cateringProvider'] }
    }).select('-password').sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user details by ID
router.get('/users/:id', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle user active status
router.put('/users/:id/toggle-status', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot modify super admin accounts' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get system statistics
router.get('/statistics', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'cateringProvider', approvalStatus: 'approved' });
    const pendingProviders = await User.countDocuments({ role: 'cateringProvider', approvalStatus: 'pending' });
    const activeUsers = await User.countDocuments({ isActive: true, role: { $ne: 'superadmin' } });

    res.json({
      totalCustomers,
      totalProviders,
      pendingProviders,
      activeUsers,
      totalUsers: await User.countDocuments({ role: { $in: ['customer', 'cateringProvider'] } })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// System configuration endpoints (placeholder for future implementation)
router.get('/config', authenticate, isSuperAdmin, async (req, res) => {
  res.json({
    maintenanceMode: false,
    registrationEnabled: true,
    providerRegistrationEnabled: true
  });
});

router.put('/config', authenticate, isSuperAdmin, async (req, res) => {
  // TODO: Implement system configuration storage
  res.json({ message: 'Configuration updated', config: req.body });
});

export default router;

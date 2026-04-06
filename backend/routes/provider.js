import express from 'express';
import User from '../models/User.js';
import { authenticate, isCateringProvider } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

/**
 * Provider Profile Routes
 * Purpose: Catering provider profile management
 * Role: cateringProvider only
 * Functions:
 *  - Get profile data
 *  - Update branding (logo, banner, about us, gallery)
 *  - Update operational rules (service area, lead time, MOV)
 *  - Update financial settings (bank account)
 *  - Upload compliance documents (requires approval)
 *  - Change password
 */

const router = express.Router();

// Get provider profile
router.get('/profile', authenticate, isCateringProvider, async (req, res) => {
  try {
    const provider = await User.findById(req.user.userId).select('-password');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Structure the response
    const response = {
      profile: {
        // Brand Identity
        businessName: provider.businessName || '',
        address: provider.address || '',
        phone: provider.phone || '',
        email: provider.email || '',
        logo: provider.logo || null,
        banner: provider.banner || null,
        aboutUs: provider.aboutUs || '',
        gallery: provider.gallery || [],

        // Operations
        serviceAreaType: provider.serviceAreaType || 'radius',
        deliveryRadius: provider.deliveryRadius || 50,
        serviceLocations: provider.serviceLocations || [],
        leadTimeDays: provider.leadTimeDays || 3,
        minimumOrderValue: provider.minimumOrderValue || 500,
        operatingDays: provider.operatingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        operatingHours: provider.operatingHours || {
          Monday: { open: '09:00', close: '18:00' },
          Tuesday: { open: '09:00', close: '18:00' },
          Wednesday: { open: '09:00', close: '18:00' },
          Thursday: { open: '09:00', close: '18:00' },
          Friday: { open: '09:00', close: '18:00' },
          Saturday: { open: '09:00', close: '18:00' },
          Sunday: { open: '09:00', close: '18:00' }
        },

        // Financial
        bankAccount: provider.bankAccount || '',
        bankName: provider.bankName || '',
        accountHolderName: provider.accountHolderName || '',
        notifications: provider.notifications || {
          email: true,
          sms: false,
          dashboard: true
        }
      },
      documents: {
        businessRegistration: { 
          current: provider.businessRegistration || null, 
          pending: provider.businessRegistrationPending || false 
        },
        foodLicense: { 
          current: provider.foodLicense || null, 
          pending: provider.foodLicensePending || false 
        },
        bankStatement: { 
          current: provider.bankStatement || null, 
          pending: provider.bankStatementPending || false 
        },
        halalCertificate: { 
          current: provider.halalCertificate || null, 
          pending: provider.halalCertificatePending || false 
        }
      },
      pendingChanges: {
        businessName: provider.businessNamePending || false,
        bankAccount: provider.bankAccountPending || false
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error loading profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update branding
router.put('/profile/branding', authenticate, isCateringProvider, async (req, res) => {
  try {
    const { 
      businessName, address, phone, email, 
      logo, banner, aboutUs, gallery, 
      pendingChanges 
    } = req.body;

    const updateData = {
      address,
      phone,
      email,
      logo,
      banner,
      aboutUs,
      gallery
    };

    // If businessName changed, mark as pending approval
    if (businessName) {
      updateData.businessNamePending = pendingChanges?.businessName || false;
      if (!pendingChanges?.businessName) {
        updateData.businessName = businessName;
      } else {
        updateData.pendingBusinessName = businessName;
      }
    }

    await User.findByIdAndUpdate(req.user.userId, updateData);

    res.json({ message: 'Branding updated successfully' });
  } catch (error) {
    console.error('Error updating branding:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update operations
router.put('/profile/operations', authenticate, isCateringProvider, async (req, res) => {
  try {
    const { 
      serviceAreaType, deliveryRadius, serviceLocations, 
      leadTimeDays, minimumOrderValue, 
      operatingDays, operatingHours 
    } = req.body;

    await User.findByIdAndUpdate(req.user.userId, {
      serviceAreaType,
      deliveryRadius,
      serviceLocations,
      leadTimeDays,
      minimumOrderValue,
      operatingDays,
      operatingHours
    });

    res.json({ message: 'Operational rules updated successfully' });
  } catch (error) {
    console.error('Error updating operations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update financial settings
router.put('/profile/financial', authenticate, isCateringProvider, async (req, res) => {
  try {
    const { 
      bankAccount, bankName, accountHolderName, 
      notifications, pendingChanges 
    } = req.body;

    const updateData = {
      bankName,
      accountHolderName,
      notifications
    };

    // If bankAccount changed, mark as pending approval
    if (bankAccount) {
      updateData.bankAccountPending = pendingChanges?.bankAccount || false;
      if (!pendingChanges?.bankAccount) {
        updateData.bankAccount = bankAccount;
      } else {
        updateData.pendingBankAccount = bankAccount;
      }
    }

    await User.findByIdAndUpdate(req.user.userId, updateData);

    res.json({ message: 'Financial settings updated successfully' });
  } catch (error) {
    console.error('Error updating financial settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload document (requires approval)
router.post('/upload-document', authenticate, isCateringProvider, async (req, res) => {
  try {
    const { documentType, documentData } = req.body;

    // Map document types to pending fields
    const pendingFieldMap = {
      businessRegistration: 'businessRegistrationPending',
      foodLicense: 'foodLicensePending',
      bankStatement: 'bankStatementPending',
      halalCertificate: 'halalCertificatePending'
    };

    const storedDocFieldMap = {
      businessRegistration: 'pendingBusinessRegistration',
      foodLicense: 'pendingFoodLicense',
      bankStatement: 'pendingBankStatement',
      halalCertificate: 'pendingHalalCertificate'
    };

    if (!pendingFieldMap[documentType]) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const updateData = {};
    updateData[pendingFieldMap[documentType]] = true;
    updateData[storedDocFieldMap[documentType]] = documentData;

    await User.findByIdAndUpdate(req.user.userId, updateData);

    res.json({ 
      message: 'Document uploaded successfully. Awaiting superadmin approval.',
      documentType 
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/change-password', authenticate, isCateringProvider, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

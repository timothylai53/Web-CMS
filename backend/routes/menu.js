import express from 'express';
import { Package, FoodItem } from '../models/Menu.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all packages (optionally filtered by providerId)
router.get('/packages', async (req, res) => {
  try {
    const { providerId } = req.query;
    const query = providerId ? { providerId } : {};
    const packages = await Package.find(query)
      .populate('providerId', 'businessName email')
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get package by ID
router.get('/packages/:id', async (req, res) => {
  try {
    const package_ = await Package.findById(req.params.id);
    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(package_);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create package (Provider only - creates for their own packages)
router.post('/packages', authenticate, isAdmin, async (req, res) => {
  try {
    const package_ = new Package({
      ...req.body,
      providerId: req.user.userId // Automatically set to authenticated provider
    });
    await package_.save();
    res.status(201).json({ message: 'Package created', package: package_ });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update package (Provider can only update their own packages)
router.put('/packages/:id', authenticate, isAdmin, async (req, res) => {
  try {
    // First check if the package belongs to this provider
    const existingPackage = await Package.findById(req.params.id);
    if (!existingPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    if (existingPackage.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own packages' });
    }
    
    const package_ = await Package.findByIdAndUpdate(
      req.params.id,
      { ...req.body, providerId: req.user.userId }, // Prevent changing providerId
      { new: true, runValidators: true }
    );
    res.json({ message: 'Package updated', package: package_ });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete package (Provider can only delete their own packages)
router.delete('/packages/:id', authenticate, isAdmin, async (req, res) => {
  try {
    // First check if the package belongs to this provider
    const package_ = await Package.findById(req.params.id);
    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }
    if (package_.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own packages' });
    }
    
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all food items (optionally filtered by providerId)
router.get('/foods', async (req, res) => {
  try {
    const { providerId } = req.query;
    const query = providerId ? { providerId } : {};
    const foods = await FoodItem.find(query).sort({ category: 1, name: 1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available food items (optionally filtered by providerId)
router.get('/foods/available', async (req, res) => {
  try {
    const { providerId } = req.query;
    const query = { available: true };
    if (providerId) {
      query.providerId = providerId;
    }
    const foods = await FoodItem.find(query).sort({ category: 1, name: 1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create food item (Provider only - creates for their own menu)
router.post('/foods', authenticate, isAdmin, async (req, res) => {
  try {
    const food = new FoodItem({
      ...req.body,
      providerId: req.user.userId // Automatically set to authenticated provider
    });
    await food.save();
    res.status(201).json({ message: 'Food item created', food });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update food item (Provider can only update their own items)
router.put('/foods/:id', authenticate, isAdmin, async (req, res) => {
  try {
    // First check if the food item belongs to this provider
    const existingFood = await FoodItem.findById(req.params.id);
    if (!existingFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    if (existingFood.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own food items' });
    }
    
    const food = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, providerId: req.user.userId }, // Prevent changing providerId
      { new: true, runValidators: true }
    );
    res.json({ message: 'Food item updated', food });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete food item (Provider can only delete their own items)
router.delete('/foods/:id', authenticate, isAdmin, async (req, res) => {
  try {
    // First check if the food item belongs to this provider
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    if (food.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own food items' });
    }
    
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

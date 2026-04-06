import express from 'express';
import InventoryItem from '../models/InventoryItem.js';
import PackList from '../models/PackList.js';
import { authenticate, isCateringProvider } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and catering provider role
router.use(authenticate, isCateringProvider);

// ============================================
// INVENTORY ITEMS ROUTES
// ============================================

// Get all inventory items for the provider
router.get('/items', async (req, res) => {
  try {
    const { itemType, category, status, search } = req.query;
    
    const providerId = req.user.userId || req.user._id;
    let query = { providerId: providerId };
    
    if (itemType) query.itemType = itemType;
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const items = await InventoryItem.find(query)
      .sort({ itemName: 1 })
      .lean();
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Failed to fetch inventory items' });
  }
});

// Get single inventory item
router.get('/items/:id', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    const item = await InventoryItem.findOne({
      _id: req.params.id,
      providerId: providerId
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

// Create new inventory item
router.post('/items', async (req, res) => {
  try {
    console.log('User from req.user:', req.user);
    
    // The JWT stores userId, not _id
    const providerId = req.user.userId || req.user._id;
    
    if (!providerId) {
      return res.status(401).json({ message: 'User not authenticated properly' });
    }
    
    const itemData = {
      ...req.body,
      providerId: providerId,
      lastUpdatedBy: providerId
    };
    
    console.log('Item data to save:', itemData);
    
    // Set initial availability for equipment
    if (itemData.itemType === 'equipment') {
      itemData.availableQuantity = itemData.totalQuantity || 0;
    }
    
    const item = new InventoryItem(itemData);
    await item.save();
    
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
});

// Update inventory item
router.put('/items/:id', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    const item = await InventoryItem.findOne({
      _id: req.params.id,
      providerId: providerId
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'providerId' && key !== '_id') {
        item[key] = req.body[key];
      }
    });
    
    item.lastUpdatedBy = providerId;
    
    // Recalculate availability for equipment
    if (item.itemType === 'equipment' && req.body.totalQuantity !== undefined) {
      const usedQuantity = item.inUseQuantity + item.damagedQuantity + item.lostQuantity;
      item.availableQuantity = Math.max(0, req.body.totalQuantity - usedQuantity);
    }
    
    await item.save();
    
    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item' });
  }
});

// Delete inventory item
router.delete('/items/:id', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    const item = await InventoryItem.findOneAndDelete({
      _id: req.params.id,
      providerId: providerId
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

// Adjust stock (consumables)
router.post('/items/:id/adjust-stock', async (req, res) => {
  try {
    const { adjustment, reason } = req.body;
    const providerId = req.user.userId || req.user._id;
    
    const item = await InventoryItem.findOne({
      _id: req.params.id,
      providerId: providerId,
      itemType: 'consumable'
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Consumable item not found' });
    }
    
    item.quantity = Math.max(0, item.quantity + adjustment);
    
    if (adjustment > 0) {
      item.lastRestocked = new Date();
    }
    
    item.lastUpdatedBy = providerId;
    item.notes = reason ? `${item.notes || ''}\n${new Date().toISOString()}: ${reason}` : item.notes;
    
    await item.save();
    
    res.json(item);
  } catch (error) {
    console.error('Error adjusting stock:', error);
    res.status(500).json({ message: 'Failed to adjust stock' });
  }
});

// Get low stock alerts
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    const items = await InventoryItem.find({
      providerId: providerId,
      itemType: 'consumable',
      $expr: { $lte: ['$quantity', '$reorderPoint'] },
      quantity: { $gt: 0 }
    }).sort({ quantity: 1 });
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching low stock alerts:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// Get expiration alerts
router.get('/alerts/expiring', async (req, res) => {
  try {
    const now = new Date();
    const providerId = req.user.userId || req.user._id;
    const items = await InventoryItem.find({
      providerId: providerId,
      itemType: 'consumable',
      expirationDate: { $exists: true }
    }).lean();
    
    // Filter items expiring within their alert window
    const expiringItems = items.filter(item => {
      if (!item.expirationDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(item.expirationDate) - now) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= (item.daysBeforeExpiryAlert || 7);
    }).sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
    
    res.json(expiringItems);
  } catch (error) {
    console.error('Error fetching expiration alerts:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// Get expired items
router.get('/alerts/expired', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    const items = await InventoryItem.find({
      providerId: providerId,
      itemType: 'consumable',
      expirationDate: { $lt: new Date() }
    }).sort({ expirationDate: 1 });
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching expired items:', error);
    res.status(500).json({ message: 'Failed to fetch expired items' });
  }
});

// Get inventory statistics
router.get('/statistics', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    
    // Count by type
    const consumablesCount = await InventoryItem.countDocuments({ 
      providerId, 
      itemType: 'consumable' 
    });
    
    const equipmentCount = await InventoryItem.countDocuments({ 
      providerId, 
      itemType: 'equipment' 
    });
    
    // Low stock count
    const lowStockCount = await InventoryItem.countDocuments({
      providerId,
      itemType: 'consumable',
      $expr: { $lte: ['$quantity', '$reorderPoint'] },
      quantity: { $gt: 0 }
    });
    
    // Expiring soon count
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringSoonCount = await InventoryItem.countDocuments({
      providerId,
      itemType: 'consumable',
      expirationDate: {
        $gte: now,
        $lte: sevenDaysLater
      }
    });
    
    // Out of stock count
    const outOfStockCount = await InventoryItem.countDocuments({
      providerId,
      itemType: 'consumable',
      quantity: 0
    });
    
    // Total inventory value
    const consumables = await InventoryItem.find({
      providerId,
      itemType: 'consumable'
    }).select('quantity costPerUnit');
    
    const totalValue = consumables.reduce((sum, item) => {
      return sum + (item.quantity * item.costPerUnit);
    }, 0);
    
    res.json({
      consumablesCount,
      equipmentCount,
      lowStockCount,
      expiringSoonCount,
      outOfStockCount,
      totalValue
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// ============================================
// PACK LIST ROUTES
// ============================================

// Get all pack lists
router.get('/pack-lists', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const providerId = req.user.userId || req.user._id;
    
    let query = { providerId: providerId };
    
    if (status) query.status = status;
    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) query.eventDate.$gte = new Date(startDate);
      if (endDate) query.eventDate.$lte = new Date(endDate);
    }
    
    const packLists = await PackList.find(query)
      .populate('equipment.equipmentId', 'itemName category')
      .sort({ eventDate: -1 });
    
    res.json(packLists);
  } catch (error) {
    console.error('Error fetching pack lists:', error);
    res.status(500).json({ message: 'Failed to fetch pack lists' });
  }
});

// Get single pack list
router.get('/pack-lists/:id', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    const packList = await PackList.findOne({
      _id: req.params.id,
      providerId: providerId
    }).populate('equipment.equipmentId', 'itemName category unit');
    
    if (!packList) {
      return res.status(404).json({ message: 'Pack list not found' });
    }
    
    res.json(packList);
  } catch (error) {
    console.error('Error fetching pack list:', error);
    res.status(500).json({ message: 'Failed to fetch pack list' });
  }
});

// Create pack list
router.post('/pack-lists', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    const packListData = {
      ...req.body,
      providerId: providerId
    };
    
    const packList = new PackList(packListData);
    await packList.save();
    
    res.status(201).json(packList);
  } catch (error) {
    console.error('Error creating pack list:', error);
    res.status(500).json({ message: 'Failed to create pack list' });
  }
});

// Update pack list
router.put('/pack-lists/:id', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    const packList = await PackList.findOne({
      _id: req.params.id,
      providerId: providerId
    });
    
    if (!packList) {
      return res.status(404).json({ message: 'Pack list not found' });
    }
    
    Object.keys(req.body).forEach(key => {
      if (key !== 'providerId' && key !== '_id') {
        packList[key] = req.body[key];
      }
    });
    
    await packList.save();
    
    res.json(packList);
  } catch (error) {
    console.error('Error updating pack list:', error);
    res.status(500).json({ message: 'Failed to update pack list' });
  }
});

// Check out equipment
router.post('/pack-lists/:id/check-out', async (req, res) => {
  try {
    const { checkedOutBy, checkoutNotes, checkoutPhotos } = req.body;
    const providerId = req.user.userId || req.user._id;
    
    const packList = await PackList.findOne({
      _id: req.params.id,
      providerId: providerId
    });
    
    if (!packList) {
      return res.status(404).json({ message: 'Pack list not found' });
    }
    
    // Update inventory - reduce available quantity
    for (const item of packList.equipment) {
      const inventoryItem = await InventoryItem.findById(item.equipmentId);
      if (inventoryItem) {
        inventoryItem.availableQuantity -= item.quantity;
        inventoryItem.inUseQuantity += item.quantity;
        await inventoryItem.save();
      }
    }
    
    packList.checkedOutAt = new Date();
    packList.checkedOutBy = checkedOutBy;
    packList.checkoutNotes = checkoutNotes;
    packList.checkoutPhotos = checkoutPhotos || [];
    packList.status = 'checked-out';
    
    await packList.save();
    
    res.json(packList);
  } catch (error) {
    console.error('Error checking out:', error);
    res.status(500).json({ message: 'Failed to check out equipment' });
  }
});

// Check in equipment
router.post('/pack-lists/:id/check-in', async (req, res) => {
  try {
    const { checkedInBy, checkinNotes, checkinPhotos, damageReport } = req.body;
    const providerId = req.user.userId || req.user._id;
    
    const packList = await PackList.findOne({
      _id: req.params.id,
      providerId: providerId
    });
    
    if (!packList) {
      return res.status(404).json({ message: 'Pack list not found' });
    }
    
    // Update inventory - restore available quantity
    for (const item of packList.equipment) {
      const inventoryItem = await InventoryItem.findById(item.equipmentId);
      if (inventoryItem) {
        let returnedQuantity = item.quantity;
        
        // Check for damages/losses in this specific item
        if (damageReport && damageReport.items) {
          const damageItem = damageReport.items.find(
            d => d.equipmentId.toString() === item.equipmentId.toString()
          );
          
          if (damageItem) {
            if (damageItem.issueType === 'lost') {
              inventoryItem.lostQuantity += damageItem.quantity;
              returnedQuantity -= damageItem.quantity;
            } else if (damageItem.issueType === 'damaged' || damageItem.issueType === 'broken') {
              inventoryItem.damagedQuantity += damageItem.quantity;
              returnedQuantity -= damageItem.quantity;
            }
          }
        }
        
        inventoryItem.inUseQuantity -= item.quantity;
        inventoryItem.availableQuantity += returnedQuantity;
        await inventoryItem.save();
      }
    }
    
    packList.checkedInAt = new Date();
    packList.checkedInBy = checkedInBy;
    packList.checkinNotes = checkinNotes;
    packList.checkinPhotos = checkinPhotos || [];
    packList.status = 'checked-in';
    
    if (damageReport) {
      packList.damageReport = damageReport;
      
      // Calculate charges
      if (damageReport.items && damageReport.items.length > 0) {
        packList.damageCharges = damageReport.items
          .filter(i => i.issueType !== 'lost')
          .reduce((sum, i) => sum + (i.estimatedCost || 0), 0);
        
        packList.lossCharges = damageReport.items
          .filter(i => i.issueType === 'lost')
          .reduce((sum, i) => sum + (i.estimatedCost || 0), 0);
      }
    }
    
    await packList.save();
    
    res.json(packList);
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({ message: 'Failed to check in equipment' });
  }
});

// Delete pack list
router.delete('/pack-lists/:id', async (req, res) => {
  try {
    const providerId = req.user.userId || req.user._id;
    const packList = await PackList.findOne({
      _id: req.params.id,
      providerId: providerId
    });
    
    if (!packList) {
      return res.status(404).json({ message: 'Pack list not found' });
    }
    
    // If equipment was checked out, restore inventory
    if (packList.status === 'checked-out' || packList.status === 'on-site') {
      for (const item of packList.equipment) {
        const inventoryItem = await InventoryItem.findById(item.equipmentId);
        if (inventoryItem) {
          inventoryItem.inUseQuantity -= item.quantity;
          inventoryItem.availableQuantity += item.quantity;
          await inventoryItem.save();
        }
      }
    }
    
    await PackList.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Pack list deleted successfully' });
  } catch (error) {
    console.error('Error deleting pack list:', error);
    res.status(500).json({ message: 'Failed to delete pack list' });
  }
});

export default router;

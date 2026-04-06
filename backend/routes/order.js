import express from 'express';
import Order from '../models/Order.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: req.user.userId
    });
    
    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'username email')
      .populate('packageId')
      .populate('providerId', 'businessName email');
    
    res.status(201).json({ 
      message: 'Order created successfully', 
      order: populatedOrder 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate('packageId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders (Provider gets their orders, Super Admin gets all)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    // If user is a catering provider, only show their orders
    const query = req.user.role === 'cateringProvider' 
      ? { providerId: req.user.userId }
      : {}; // Super admin sees all orders
    
    const orders = await Order.find(query)
      .populate('userId', 'username email phoneNumber')
      .populate('packageId')
      .populate('providerId', 'businessName email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'username email phoneNumber')
      .populate('packageId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin/provider
    if (order.userId._id.toString() !== req.user.userId && 
        !['admin', 'cateringProvider', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (Admin only)
router.put('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'username email').populate('packageId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update payment status (Admin only)
router.put('/:id/payment', authenticate, isAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('userId', 'username email').populate('packageId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update delivery status (Admin only)
router.put('/:id/delivery', authenticate, isAdmin, async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus },
      { new: true }
    ).populate('userId', 'username email').populate('packageId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Delivery status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete order (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

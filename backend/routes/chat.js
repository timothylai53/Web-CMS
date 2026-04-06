import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for chat file uploads
const uploadsDir = path.join(__dirname, '..', 'uploads', 'chat');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `chat-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocs = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];
  if ([...allowedImages, ...allowedDocs].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Get all conversations
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const sentMessages = await Message.distinct('receiver', { sender: userId });
    const receivedMessages = await Message.distinct('sender', { receiver: userId });
    const contactIds = [...new Set([...sentMessages.map(String), ...receivedMessages.map(String)])];

    const conversations = [];

    for (const contactId of contactIds) {
      const contact = await User.findById(contactId)
        .select('username fullName businessName role email');
      if (!contact) continue;

      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, receiver: contactId },
          { sender: contactId, receiver: userId }
        ]
      }).sort({ createdAt: -1 });

      const unreadCount = await Message.countDocuments({
        sender: contactId,
        receiver: userId,
        read: false
      });

      conversations.push({
        user: contact,
        lastMessage: lastMessage ? {
          message: lastMessage.message,
          messageType: lastMessage.messageType || 'text',
          fileName: lastMessage.fileName,
          createdAt: lastMessage.createdAt,
          sender: lastMessage.sender
        } : null,
        unreadCount
      });
    }

    conversations.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt || 0;
      const timeB = b.lastMessage?.createdAt || 0;
      return new Date(timeB) - new Date(timeA);
    });

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages with a specific user
router.get('/messages/:userId', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(200);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send a text message
router.post('/send', authenticate, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.userId;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({ message: 'Receiver and message are required' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),
      messageType: 'text'
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send a file (image or document)
router.post('/send-file', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.userId;
    const file = req.file;

    if (!receiverId || !file) {
      return res.status(400).json({ message: 'Receiver and file are required' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Determine message type from mimetype
    const isImage = file.mimetype.startsWith('image/');
    const messageType = isImage ? 'image' : 'document';
    const fileUrl = `/uploads/chat/${file.filename}`;

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message: isImage ? '📷 Photo' : `📄 ${file.originalname}`,
      messageType,
      fileName: file.originalname,
      fileSize: file.size,
      fileUrl
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending file:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark all messages from a specific user as read
router.put('/read/:userId', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const senderUserId = req.params.userId;

    await Message.updateMany(
      { sender: senderUserId, receiver: currentUserId, read: false },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get total unread message count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const unreadCount = await Message.countDocuments({
      receiver: userId,
      read: false
    });
    res.json({ unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

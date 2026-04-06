import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Purpose: Verify JWT tokens and enforce role-based access control
 */

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware for Catering Provider access
export const isCateringProvider = (req, res, next) => {
  if (req.user.role !== 'cateringProvider') {
    return res.status(403).json({ message: 'Access denied. Catering Provider only.' });
  }
  next();
};

// Middleware for Super Admin access
export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Super Admin only.' });
  }
  next();
};

// Middleware for approved Catering Provider
export const isApprovedProvider = (req, res, next) => {
  if (req.user.role !== 'cateringProvider' || req.user.approvalStatus !== 'approved') {
    return res.status(403).json({ message: 'Access denied. Approved Catering Provider only.' });
  }
  next();
};

// Legacy support (deprecated, use isCateringProvider instead)
export const isAdmin = isCateringProvider;

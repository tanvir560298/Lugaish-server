import jwt from 'jsonwebtoken';
import config from '../config.js';
import { User } from '../models/User.js';
import { hasPermission } from '../utils/roles.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requirePermission = permission => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('role');
    if (!user || !hasPermission(user.role, permission)) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }

    req.userRole = user.role;
    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

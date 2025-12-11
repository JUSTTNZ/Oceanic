import { Router } from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply JWT verification to all routes
router.use(verifyJWT);

// Get all notifications
router.get('/', getNotifications);

// Get unread count
router.get('/unread/count', getUnreadCount);

// Mark specific notification as read
router.patch('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.post('/mark-all/read', markAllAsRead);

export default router;

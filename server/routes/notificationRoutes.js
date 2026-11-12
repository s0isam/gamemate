const express = require('express');
const { getNotifications, markNotificationRead, markAllNotificationsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validateRequest');
const schemas = require('../validation/schemas');

const router = express.Router();

router.get('/', protect, asyncHandler(getNotifications));
router.put('/:id/read', protect, validateRequest(schemas.notificationId), asyncHandler(markNotificationRead));
router.put('/read-all', protect, asyncHandler(markAllNotificationsRead));

module.exports = router;

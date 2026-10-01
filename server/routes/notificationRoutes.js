const express = require('express');
const { getNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, getNotifications);
router.put('/read-all', protect, getNotifications);

module.exports = router;

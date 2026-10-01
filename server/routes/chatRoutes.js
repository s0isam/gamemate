const express = require('express');
const { getMessages, addMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:teamId/messages', protect, getMessages);
router.post('/:teamId/messages', protect, addMessage);

module.exports = router;

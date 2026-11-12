const express = require('express');
const { getMessages, addMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validateRequest');
const schemas = require('../validation/schemas');
const sensitiveRateLimit = require('../middleware/sensitiveRateLimit');

const router = express.Router();

router.get('/:teamId/messages', protect, validateRequest(schemas.chatQuery), asyncHandler(getMessages));
router.post('/:teamId/messages', protect, sensitiveRateLimit, validateRequest(schemas.chatMessage), asyncHandler(addMessage));

module.exports = router;

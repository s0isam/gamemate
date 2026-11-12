const express = require('express');
const {
  getProfile,
  getAllGamers,
  getGamerById,
  getNearbyGamers,
  updateProfile,
  updateStatus,
  updateLocation,
} = require('../controllers/gamerController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validateRequest');
const schemas = require('../validation/schemas');
const sensitiveRateLimit = require('../middleware/sensitiveRateLimit');

const router = express.Router();

router.get('/me', protect, asyncHandler(getProfile));
router.get('/', protect, asyncHandler(getAllGamers));
router.get('/nearby', protect, validateRequest(schemas.nearbyGamers), asyncHandler(getNearbyGamers));
router.get('/:id', protect, validateRequest(schemas.gamerId), asyncHandler(getGamerById));
router.put('/profile', protect, validateRequest(schemas.profileUpdate), asyncHandler(updateProfile));
router.put('/status', protect, validateRequest(schemas.statusUpdate), asyncHandler(updateStatus));
router.put('/location', protect, sensitiveRateLimit, validateRequest(schemas.locationUpdate), asyncHandler(updateLocation));

module.exports = router;

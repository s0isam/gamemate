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

const router = express.Router();

router.get('/me', protect, getProfile);
router.get('/', protect, getAllGamers);
router.get('/nearby', protect, getNearbyGamers);
router.get('/:id', protect, getGamerById);
router.put('/profile', protect, updateProfile);
router.put('/status', protect, updateStatus);
router.put('/location', protect, updateLocation);

module.exports = router;

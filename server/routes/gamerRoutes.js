const express = require('express');
const { getAllGamers, getNearbyGamers } = require('../controllers/gamerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAllGamers);
router.get('/nearby', protect, getNearbyGamers);
router.get('/:id', protect, getAllGamers);
router.put('/profile', protect, getAllGamers);
router.put('/status', protect, getAllGamers);
router.put('/location', protect, getAllGamers);

module.exports = router;

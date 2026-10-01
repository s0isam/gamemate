const express = require('express');
const {
  getTeamRequests,
  createTeamRequest,
  acceptTeamRequest,
  rejectTeamRequest,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/requests', protect, getTeamRequests);
router.post('/requests', protect, createTeamRequest);
router.put('/requests/:id/accept', protect, acceptTeamRequest);
router.put('/requests/:id/reject', protect, rejectTeamRequest);

module.exports = router;

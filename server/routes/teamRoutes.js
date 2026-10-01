const express = require('express');
const {
  getMyTeams,
  getTeamById,
  leaveTeam,
  getTeamRequests,
  createTeamRequest,
  acceptTeamRequest,
  rejectTeamRequest,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyTeams);
router.get('/requests', protect, getTeamRequests);
router.post('/requests', protect, createTeamRequest);
router.put('/requests/:id/accept', protect, acceptTeamRequest);
router.put('/requests/:id/reject', protect, rejectTeamRequest);
router.get('/:id', protect, getTeamById);
router.post('/:id/leave', protect, leaveTeam);

module.exports = router;

const express = require('express');
const {
  getMyTeams,
  createTeam,
  getTeamById,
  leaveTeam,
  transferTeamLeadership,
  joinTeamByLobbyCode,
  getTeamRequests,
  createTeamRequest,
  acceptTeamRequest,
  rejectTeamRequest,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyTeams);
router.post('/', protect, createTeam);
router.get('/requests', protect, getTeamRequests);
router.post('/requests', protect, createTeamRequest);
router.put('/requests/:id/accept', protect, acceptTeamRequest);
router.put('/requests/:id/reject', protect, rejectTeamRequest);
router.post('/join', protect, joinTeamByLobbyCode);
router.get('/:id', protect, getTeamById);
router.post('/:id/leave', protect, leaveTeam);
router.put('/:id/leadership', protect, transferTeamLeadership);

module.exports = router;

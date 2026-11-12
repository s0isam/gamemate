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
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validateRequest');
const schemas = require('../validation/schemas');
const sensitiveRateLimit = require('../middleware/sensitiveRateLimit');

const router = express.Router();

router.get('/', protect, asyncHandler(getMyTeams));
router.post('/', protect, validateRequest(schemas.teamCreate), asyncHandler(createTeam));
router.get('/requests', protect, asyncHandler(getTeamRequests));
router.post('/requests', protect, sensitiveRateLimit, validateRequest(schemas.teamRequest), asyncHandler(createTeamRequest));
router.put('/requests/:id/accept', protect, validateRequest(schemas.teamRequestId), asyncHandler(acceptTeamRequest));
router.put('/requests/:id/reject', protect, validateRequest(schemas.teamRequestId), asyncHandler(rejectTeamRequest));
router.post('/join', protect, sensitiveRateLimit, validateRequest(schemas.teamJoin), asyncHandler(joinTeamByLobbyCode));
router.get('/:id', protect, validateRequest(schemas.teamId), asyncHandler(getTeamById));
router.post('/:id/leave', protect, validateRequest(schemas.teamId), asyncHandler(leaveTeam));
router.put('/:id/leadership', protect, validateRequest(schemas.teamLeadership), asyncHandler(transferTeamLeadership));

module.exports = router;

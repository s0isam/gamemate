const express = require('express');
const { getTeamRequests, createTeamRequest } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/requests', protect, createTeamRequest);
router.get('/requests', protect, getTeamRequests);
router.put('/requests/:id/accept', protect, getTeamRequests);
router.put('/requests/:id/reject', protect, getTeamRequests);
router.get('/', protect, getTeamRequests);
router.get('/:id', protect, getTeamRequests);
router.post('/', protect, createTeamRequest);
router.put('/:id', protect, getTeamRequests);
router.delete('/:id', protect, getTeamRequests);
router.post('/:id/leave', protect, getTeamRequests);

module.exports = router;

const express = require('express');
const { getGames, getGameById } = require('../controllers/gameController');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validateRequest');
const schemas = require('../validation/schemas');

const router = express.Router();

router.get('/', asyncHandler(getGames));
router.get('/:id', validateRequest(schemas.gameId), asyncHandler(getGameById));

module.exports = router;

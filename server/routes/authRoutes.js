const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validateRequest');
const schemas = require('../validation/schemas');

const router = express.Router();
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Try again later.' },
});

router.post('/register', authRateLimit, validateRequest(schemas.authRegister), asyncHandler(registerUser));
router.post('/login', authRateLimit, validateRequest(schemas.authLogin), asyncHandler(loginUser));
router.get('/me', asyncHandler(protect), asyncHandler(getCurrentUser));

module.exports = router;

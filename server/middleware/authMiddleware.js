const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/env');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  let decoded;
  try {
    const token = authHeader.split(' ')[1];
    decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  if (!decoded || typeof decoded.id !== 'string' || !/^[a-f\d]{24}$/i.test(decoded.id)) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  let user;
  try {
    user = await User.findById(decoded.id).select('-password');
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  req.user = user;
  next();
};

module.exports = { protect };

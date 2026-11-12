const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;

const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: `user_${Date.now()}`,
      username,
      email,
      password: hashedPassword,
    };

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const demoUser = {
      id: 'demo_user_1',
      email,
      username: 'demoPlayer',
      password: await bcrypt.hash('password123', 10),
    };

    const isMatch = await bcrypt.compare(password, demoUser.password);

    if (!isMatch || demoUser.email !== email) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(demoUser.id);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: demoUser.id,
          username: demoUser.username,
          email: demoUser.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user?.id || 'demo_user_1',
        username: 'demoPlayer',
        email: 'demo@gamemate.app',
      },
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};

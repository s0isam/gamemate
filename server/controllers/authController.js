const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, profileImage, age, games, preferredLanguages, microphoneAvailable, bio } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with that email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      profileImage,
      age,
      games: games || [],
      preferredLanguages: preferredLanguages || [],
      microphoneAvailable: microphoneAvailable || false,
      bio,
      gamingStatus: 'Looking for Team',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          games: user.games,
          preferredLanguages: user.preferredLanguages,
          microphoneAvailable: user.microphoneAvailable,
          bio: user.bio,
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

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          games: user.games,
          preferredLanguages: user.preferredLanguages,
          microphoneAvailable: user.microphoneAvailable,
          bio: user.bio,
          gamingStatus: user.gamingStatus,
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
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        profileImage: req.user.profileImage,
        games: req.user.games,
        preferredLanguages: req.user.preferredLanguages,
        microphoneAvailable: req.user.microphoneAvailable,
        bio: req.user.bio,
        gamingStatus: req.user.gamingStatus,
      },
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};

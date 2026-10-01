const User = require('../models/User');

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found' });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const getAllGamers = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('-password').sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: users,
  });
};

const getGamerById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'Gamer not found' });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const updateProfile = async (req, res) => {
  const allowedFields = {
    username: req.body.username,
    profileImage: req.body.profileImage,
    age: req.body.age,
    games: req.body.games,
    preferredLanguages: req.body.preferredLanguages,
    microphoneAvailable: req.body.microphoneAvailable,
    bio: req.body.bio,
    skillLevel: req.body.skillLevel,
  };

  Object.keys(allowedFields).forEach((key) => {
    if (allowedFields[key] === undefined) {
      delete allowedFields[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: allowedFields },
    { new: true, runValidators: true }
  ).select('-password');

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const updateStatus = async (req, res) => {
  const { gamingStatus } = req.body;

  if (!gamingStatus) {
    return res.status(400).json({ success: false, message: 'Gaming status is required' });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { gamingStatus } },
    { new: true, runValidators: true }
  ).select('-password');

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { location: { type: 'Point', coordinates: [longitude, latitude] } } },
    { new: true, runValidators: true }
  ).select('-password');

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const getNearbyGamers = async (req, res) => {
  const { game, radius = 10, language, microphone, skillLevel } = req.query;

  const filter = {
    _id: { $ne: req.user._id },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: req.user.location?.coordinates || [0, 0],
        },
        $maxDistance: Number(radius) * 1000,
      },
    },
  };

  if (game) filter.games = game;
  if (language) filter.preferredLanguages = language;
  if (microphone !== undefined) filter.microphoneAvailable = microphone === 'true';
  if (skillLevel) filter.skillLevel = skillLevel;

  const users = await User.find(filter).select('-password');

  const payload = users.map((user) => {
    const distanceKm = user.location?.coordinates?.length
      ? Math.round(
          ((user.location.coordinates[0] - (req.user.location?.coordinates?.[0] || 0)) ** 2 +
            (user.location.coordinates[1] - (req.user.location?.coordinates?.[1] || 0)) ** 2) ** 0.5 * 111.32
        )
      : 0;

    return {
      ...user.toObject(),
      distance: `${distanceKm} km away`,
      matchScore: 85,
    };
  });

  return res.status(200).json({
    success: true,
    data: payload,
  });
};

module.exports = {
  getProfile,
  getAllGamers,
  getGamerById,
  updateProfile,
  updateStatus,
  updateLocation,
  getNearbyGamers,
};

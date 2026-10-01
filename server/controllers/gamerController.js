const User = require('../models/User');

const calculateDistanceKm = (fromCoordinates, toCoordinates) => {
  if (!fromCoordinates || !toCoordinates || fromCoordinates.length < 2 || toCoordinates.length < 2) {
    return null;
  }

  const [fromLon, fromLat] = fromCoordinates;
  const [toLon, toLat] = toCoordinates;

  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLon - fromLon);

  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const formatDistanceLabel = (distanceKm) => {
  if (distanceKm === null || Number.isNaN(distanceKm)) {
    return 'Nearby';
  }

  if (distanceKm < 1) {
    return 'Nearby';
  }

  if (distanceKm < 10) {
    return `Within ${distanceKm.toFixed(1)} km`;
  }

  return `Within ${Math.round(distanceKm)} km`;
};

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
  const users = await User.find({ _id: { $ne: req.user._id } }).select('-password -location').sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: users,
  });
};

const getGamerById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -location');

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

  if (!req.user.location || !Array.isArray(req.user.location.coordinates) || req.user.location.coordinates.length !== 2) {
    return res.status(200).json({ success: true, data: [] });
  }

  const query = {
    _id: { $ne: req.user._id },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: req.user.location.coordinates,
        },
        $maxDistance: Number(radius) * 1000,
      },
    },
  };

  if (game) query.games = game;
  if (language) query.preferredLanguages = language;
  if (microphone !== undefined) query.microphoneAvailable = microphone === 'true';
  if (skillLevel) query.skillLevel = skillLevel;

  const users = await User.find(query).select('-password');

  const payload = users.map((user) => {
    const safeUser = user.toObject();
    const distanceKm = calculateDistanceKm(req.user.location.coordinates, safeUser.location?.coordinates || req.user.location.coordinates);
    const distanceLabel = formatDistanceLabel(distanceKm);

    delete safeUser.location;

    return {
      ...safeUser,
      distanceKm: distanceKm === null ? 0 : Number(distanceKm.toFixed(1)),
      distanceLabel,
      matchScore: Math.max(70, 100 - Math.round((distanceKm || 0) * 2)),
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

const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    data: notifications,
  });
};

const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  return res.status(200).json({
    success: true,
    data: notification,
  });
};

const markAllNotificationsRead = async (req, res) => {
  const result = await Notification.updateMany({ user: req.user._id, read: false }, { read: true });

  return res.status(200).json({
    success: true,
    data: {
      updatedCount: result.modifiedCount,
    },
  });
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};

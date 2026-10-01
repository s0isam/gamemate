const getNotifications = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: [],
  });
};

module.exports = {
  getNotifications,
};

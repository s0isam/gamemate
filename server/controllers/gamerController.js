const getAllGamers = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: [],
  });
};

const getNearbyGamers = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: [],
  });
};

module.exports = {
  getAllGamers,
  getNearbyGamers,
};

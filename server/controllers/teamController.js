const getTeamRequests = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: [],
  });
};

const createTeamRequest = async (req, res) => {
  return res.status(201).json({
    success: true,
    data: { message: 'Team request created.' },
  });
};

module.exports = {
  getTeamRequests,
  createTeamRequest,
};

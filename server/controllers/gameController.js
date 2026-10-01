const Game = require('../models/Game');

const getGames = async (req, res) => {
  const games = await Game.find().sort({ name: 1 });

  return res.status(200).json({
    success: true,
    data: games,
  });
};

const getGameById = async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).json({ success: false, message: 'Game not found' });
  }

  return res.status(200).json({
    success: true,
    data: game,
  });
};

module.exports = {
  getGames,
  getGameById,
};

const Team = require('../models/Team');
const Message = require('../models/Message');
const socketHandler = require('../socket/socketHandler');

const getMessages = async (req, res) => {
  const { teamId } = req.params;
  const { page = 1, limit = 100 } = req.validated?.query || {};

  const team = await Team.findById(teamId);

  if (!team) {
    return res.status(404).json({ success: false, message: 'Team not found' });
  }

  const isMember = team.leader.toString() === req.user._id.toString() || team.members.some((member) => member.toString() === req.user._id.toString());

  if (!isMember) {
    return res.status(403).json({ success: false, message: 'You are not allowed to view this team chat' });
  }

  const messages = await Message.find({ team: teamId })
    .populate('sender', 'username profileImage')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return res.status(200).json({
    success: true,
    data: messages.reverse(),
  });
};

const addMessage = async (req, res) => {
  const { teamId } = req.params;
  const { text } = req.body;

  const team = await Team.findById(teamId);

  if (!team) {
    return res.status(404).json({ success: false, message: 'Team not found' });
  }

  const isMember = team.leader.toString() === req.user._id.toString() || team.members.some((member) => member.toString() === req.user._id.toString());

  if (!isMember) {
    return res.status(403).json({ success: false, message: 'You are not allowed to send in this team chat' });
  }

  const message = await Message.create({
    sender: req.user._id,
    team: teamId,
    text,
  });

  const populatedMessage = await message.populate('sender', 'username profileImage');

  if (socketHandler && typeof socketHandler.emitTeamMessage === 'function') {
    socketHandler.emitTeamMessage(teamId, populatedMessage);
  }

  return res.status(201).json({
    success: true,
    data: populatedMessage,
  });
};

module.exports = {
  getMessages,
  addMessage,
};

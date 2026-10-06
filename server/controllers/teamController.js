const Team = require('../models/Team');
const TeamRequest = require('../models/TeamRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const socketHandler = require('../socket/socketHandler');
const crypto = require('crypto');

const generateLobbyCode = () => crypto.randomBytes(5).toString('hex').toUpperCase();

const createNotificationForUser = async (userId, message, type = 'teamRequest') => {
  const notification = await Notification.create({ user: userId, message, type });

  if (socketHandler && typeof socketHandler.emitNotification === 'function') {
    socketHandler.emitNotification(userId, notification);
  }

  return notification;
};

const getMyTeams = async (req, res) => {
  const teams = await Team.find({
    $or: [{ leader: req.user._id }, { members: req.user._id }],
  })
    .populate('leader', 'username profileImage gamingStatus')
    .populate('members', 'username profileImage gamingStatus')
    .sort({ updatedAt: -1 });

  for (const team of teams) {
    if (!team.lobbyCode) {
      team.lobbyCode = generateLobbyCode();
      await team.save();
    }
  }

  return res.status(200).json({
    success: true,
    data: teams,
  });
};

const getTeamById = async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('leader', 'username profileImage gamingStatus')
    .populate('members', 'username profileImage gamingStatus');

  if (!team) {
    return res.status(404).json({ success: false, message: 'Team not found' });
  }

  const isMember = team.leader._id.toString() === req.user._id.toString() || team.members.some((member) => member._id.toString() === req.user._id.toString());

  if (!isMember) {
    return res.status(403).json({ success: false, message: 'You are not a member of this team' });
  }

  return res.status(200).json({
    success: true,
    data: team,
  });
};

const leaveTeam = async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({ success: false, message: 'Team not found' });
  }

  if (team.leader.toString() === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Team leader must transfer leadership before leaving' });
  }

  const isMember = team.members.some((member) => member.toString() === req.user._id.toString());
  if (!isMember) {
    return res.status(403).json({ success: false, message: 'You are not a member of this team' });
  }

  team.members = team.members.filter((member) => member.toString() !== req.user._id.toString());

  const memberIds = new Set([team.leader.toString(), ...team.members.map((member) => member.toString())]);
  if (memberIds.size >= team.maxPlayers) {
    team.status = 'full';
  } else if (team.status === 'full') {
    team.status = 'active';
  }

  await team.save();

  return res.status(200).json({
    success: true,
    data: team,
  });
};

const transferTeamLeadership = async (req, res) => {
  const memberId = req.body?.memberId;
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({ success: false, message: 'Team not found' });
  }

  if (team.leader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Only the team leader can transfer leadership' });
  }

  if (!memberId || memberId === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Choose another team member to become leader' });
  }

  const isMember = team.members.some((member) => member.toString() === memberId);
  if (!isMember) {
    return res.status(400).json({ success: false, message: 'The new leader must already be a team member' });
  }

  const previousLeaderId = team.leader.toString();
  if (!team.members.some((member) => member.toString() === previousLeaderId)) {
    team.members.push(team.leader);
  }
  team.leader = memberId;
  await team.save();

  const updatedTeam = await Team.findById(team._id)
    .populate('leader', 'username profileImage gamingStatus')
    .populate('members', 'username profileImage gamingStatus');

  return res.status(200).json({ success: true, data: updatedTeam });
};

const joinTeamByLobbyCode = async (req, res) => {
  const lobbyCode = String(req.body?.lobbyCode || '').trim().toUpperCase();

  if (!/^[A-F0-9]{10}$/.test(lobbyCode)) {
    return res.status(400).json({ success: false, message: 'Enter a valid 10-character lobby code' });
  }

  const team = await Team.findOne({ lobbyCode });
  if (!team) {
    return res.status(404).json({ success: false, message: 'No team was found for that lobby code' });
  }

  if (team.status !== 'active') {
    return res.status(400).json({ success: false, message: 'This lobby is not accepting new players' });
  }

  const memberIds = new Set([team.leader.toString(), ...team.members.map((member) => member.toString())]);
  if (memberIds.has(req.user._id.toString())) {
    return res.status(409).json({ success: false, message: 'You are already in this team' });
  }

  if (memberIds.size >= team.maxPlayers) {
    team.status = 'full';
    await team.save();
    return res.status(400).json({ success: false, message: 'This lobby is full' });
  }

  team.members.push(req.user._id);
  if (memberIds.size + 1 >= team.maxPlayers) {
    team.status = 'full';
  }
  await team.save();

  const joinedTeam = await Team.findById(team._id)
    .populate('leader', 'username profileImage gamingStatus')
    .populate('members', 'username profileImage gamingStatus');

  return res.status(200).json({ success: true, data: joinedTeam });
};

const getTeamRequests = async (req, res) => {
  const requests = await TeamRequest.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
  })
    .populate('sender', 'username profileImage gamingStatus')
    .populate('receiver', 'username profileImage gamingStatus')
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: requests,
  });
};

const createTeamRequest = async (req, res) => {
  const { receiverId, game, message } = req.body;

  if (!receiverId || !game) {
    return res.status(400).json({ success: false, message: 'Receiver and game are required' });
  }

  if (receiverId.toString() === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'You cannot request to team up with yourself' });
  }

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    return res.status(404).json({ success: false, message: 'Receiver not found' });
  }

  const existingRequest = await TeamRequest.findOne({
    sender: req.user._id,
    receiver: receiverId,
    game,
    status: 'pending',
  });

  if (existingRequest) {
    return res.status(409).json({ success: false, message: 'A pending request already exists for this gamer' });
  }

  const request = await TeamRequest.create({
    sender: req.user._id,
    receiver: receiverId,
    game,
    message: message || `I want to team up for ${game}.`,
  });

  const notification = await createNotificationForUser(
    receiverId,
    `${req.user.username} wants to team up for ${game}.`,
    'teamRequest'
  );

  return res.status(201).json({
    success: true,
    data: { request, notification },
  });
};

const acceptTeamRequest = async (req, res) => {
  const request = await TeamRequest.findById(req.params.id)
    .populate('sender', 'username')
    .populate('receiver', 'username');

  if (!request) {
    return res.status(404).json({ success: false, message: 'Team request not found' });
  }

  if (request.receiver._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'You are not allowed to accept this request' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'This request is no longer pending' });
  }

  let team = await Team.findOne({
    game: request.game,
    status: { $ne: 'closed' },
    members: { $in: [request.sender._id, request.receiver._id] },
  });

  if (team) {
    if (team.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This team is not accepting new players' });
    }

    const memberIds = new Set([
      team.leader.toString(),
      ...team.members.map((member) => member.toString()),
      request.sender._id.toString(),
      request.receiver._id.toString(),
    ]);
    if (memberIds.size > team.maxPlayers) {
      return res.status(400).json({ success: false, message: 'There is not enough room in this team' });
    }
  }

  request.status = 'accepted';
  await request.save();

  if (!team) {
    team = await Team.create({
      game: request.game,
      leader: request.receiver._id,
      members: [request.receiver._id, request.sender._id],
      maxPlayers: 4,
      status: 'active',
    });
  } else {
    if (!team.members.some((member) => member.toString() === request.sender._id.toString())) {
      team.members.push(request.sender._id);
    }
    if (!team.members.some((member) => member.toString() === request.receiver._id.toString())) {
      team.members.push(request.receiver._id);
    }
    const memberIds = new Set([team.leader.toString(), ...team.members.map((member) => member.toString())]);
    if (memberIds.size >= team.maxPlayers) {
      team.status = 'full';
    }
    await team.save();
  }

  await createNotificationForUser(
    request.sender._id,
    `${req.user.username} accepted your request for ${request.game}.`,
    'teamRequestAccepted'
  );

  return res.status(200).json({
    success: true,
    data: { request, team },
  });
};

const rejectTeamRequest = async (req, res) => {
  const request = await TeamRequest.findById(req.params.id).populate('sender', 'username').populate('receiver', 'username');

  if (!request) {
    return res.status(404).json({ success: false, message: 'Team request not found' });
  }

  if (request.receiver._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'You are not allowed to reject this request' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'This request has already been handled' });
  }

  request.status = 'rejected';
  await request.save();

  await createNotificationForUser(
    request.sender._id,
    `${req.user.username} rejected your request for ${request.game}.`,
    'teamRequestRejected'
  );

  return res.status(200).json({
    success: true,
    data: request,
  });
};

module.exports = {
  getMyTeams,
  getTeamById,
  leaveTeam,
  transferTeamLeadership,
  joinTeamByLobbyCode,
  getTeamRequests,
  createTeamRequest,
  acceptTeamRequest,
  rejectTeamRequest,
};

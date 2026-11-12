const socketHandler = (server) => {
  const { Server } = require('socket.io');
  const jwt = require('jsonwebtoken');
  const Team = require('../models/Team');
  const User = require('../models/User');
  const { jwtSecret } = require('../config/env');
  const isAllowedClientOrigin = require('../config/clientOrigin');

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isAllowedClientOrigin(origin)) {
          return callback(null, true);
        }

        return callback(new Error('Client origin is not allowed by CORS'));
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.headers.authorization;
      const token = socket.handshake.auth?.token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

      if (!token) {
        return next(new Error('Authentication required for socket connection.'));
      }

      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found for socket connection.'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid or expired socket token.'));
    }
  });

  socketHandler.io = io;

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id, 'user:', socket.user?._id?.toString());

    socket.on('join-room', (roomId) => {
      if (!roomId) {
        return;
      }

      socket.join(String(roomId));
    });

    socket.on('join-user', (userId) => {
      if (!userId || String(socket.user._id) !== String(userId)) {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      socket.join(String(userId));
    });

    socket.on('join-team', async (teamId) => {
      if (!teamId) {
        return;
      }

      try {
        const team = await Team.findOne({
          _id: teamId,
          $or: [{ leader: socket.user._id }, { members: socket.user._id }],
        });

        if (!team) {
          socket.emit('error', { message: 'You are not a member of this team' });
          return;
        }

        socket.join(String(teamId));
      } catch (error) {
        socket.emit('error', { message: 'Unable to access this team' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

socketHandler.emitNotification = (userId, notification) => {
  if (!userId || !socketHandler.io) {
    return;
  }

  socketHandler.io.to(String(userId)).emit('new-notification', notification);
};

socketHandler.emitTeamMessage = (teamId, message) => {
  if (!teamId || !socketHandler.io) {
    return;
  }

  socketHandler.io.to(String(teamId)).emit('team-message', message);
};

module.exports = socketHandler;

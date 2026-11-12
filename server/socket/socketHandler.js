const socketHandler = (server) => {
  const { Server } = require('socket.io');
  const jwt = require('jsonwebtoken');
  const mongoose = require('mongoose');
  const Team = require('../models/Team');
  const User = require('../models/User');
  const { jwtSecret } = require('../config/env');
  const isAllowedClientOrigin = require('../config/clientOrigin');
  const userRoom = (userId) => `user:${userId}`;
  const teamRoom = (teamId) => `team:${teamId}`;

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
    let decoded;
    try {
      const authHeader = socket.handshake.headers.authorization;
      const token = socket.handshake.auth?.token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

      if (!token) {
        return next(new Error('Authentication required for socket connection.'));
      }

      decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    } catch (error) {
      return next(new Error('Invalid or expired socket token.'));
    }

    if (typeof decoded.id !== 'string' || !mongoose.isValidObjectId(decoded.id)) {
      return next(new Error('Invalid or expired socket token.'));
    }

    try {
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found for socket connection.'));
      }

      socket.user = user;
      socket.data.userId = user._id.toString();
      next();
    } catch (error) {
      console.error('Socket authentication failed:', error.message);
      next(new Error('Unable to authenticate socket connection.'));
    }
  });

  socketHandler.io = io;

  io.on('connection', (socket) => {
    socket.join(userRoom(socket.data.userId));

    socket.on('join-team', async (teamId) => {
      if (typeof teamId !== 'string' || !mongoose.isValidObjectId(teamId)) {
        socket.emit('socket-error', { message: 'Invalid team ID' });
        return;
      }

      try {
        const team = await Team.findOne({
          _id: teamId,
          $or: [{ leader: socket.user._id }, { members: socket.user._id }],
        });

        if (!team) {
          socket.emit('socket-error', { message: 'You are not a member of this team' });
          return;
        }

        socket.join(teamRoom(team._id.toString()));
      } catch (error) {
        console.error('Socket team-room authorization failed:', error.message);
        socket.emit('socket-error', { message: 'Unable to access this team' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id, 'user:', socket.data.userId);
    });
  });

  return io;
};

socketHandler.emitNotification = (userId, notification) => {
  if (!userId || !socketHandler.io) {
    return;
  }

  socketHandler.io.to(`user:${userId}`).emit('new-notification', notification);
};

socketHandler.emitTeamMessage = (teamId, message) => {
  if (!teamId || !socketHandler.io) {
    return;
  }

  socketHandler.io.to(`team:${teamId}`).emit('team-message', message);
};

socketHandler.removeUserFromTeam = (teamId, userId) => {
  if (!teamId || !userId || !socketHandler.io) {
    return;
  }

  const room = `team:${teamId}`;
  for (const socket of socketHandler.io.sockets.sockets.values()) {
    if (socket.data.userId === String(userId)) {
      socket.leave(room);
    }
  }
};

module.exports = socketHandler;

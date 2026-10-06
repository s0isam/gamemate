const socketHandler = (server) => {
  const { Server } = require('socket.io');
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

  socketHandler.io = io;

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('join-user', (userId) => {
      if (userId) {
        socket.join(String(userId));
      }
    });

    socket.on('join-team', (teamId) => {
      if (teamId) {
        socket.join(String(teamId));
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

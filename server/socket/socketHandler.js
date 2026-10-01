const socketHandler = (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
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

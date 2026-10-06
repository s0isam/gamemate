import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = ({ userId, onNotification, onTeamMessage } = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socketRef.current = socket;

    if (userId) {
      socket.emit('join-user', userId);
    }

    if (onNotification) {
      socket.on('new-notification', onNotification);
    }

    if (onTeamMessage) {
      socket.on('team-message', onTeamMessage);
    }

    return () => {
      if (onNotification) {
        socket.off('new-notification', onNotification);
      }

      if (onTeamMessage) {
        socket.off('team-message', onTeamMessage);
      }

      socket.disconnect();
    };
  }, [userId, onNotification, onTeamMessage]);

  return socketRef.current;
};

export default useSocket;

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { resolveBackendUrl } from '../services/backendUrl';

export const SocketContext = createContext(null);

const socketUrl = resolveBackendUrl(import.meta.env.VITE_SOCKET_URL, 5000);

export const SocketProvider = ({ children }) => {
  const [socket] = useState(() => io(socketUrl));
  const { user } = useAuth();

  useEffect(() => {
    const onConnect = () => {
      console.log('Socket connected');
      if (user?._id) {
        socket.emit('join-user', String(user._id));
      }
    };

    const onDisconnect = () => {
      console.log('Socket disconnected');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected && user?._id) {
      socket.emit('join-user', String(user._id));
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket, user?._id]);

  const value = useMemo(() => ({ socket }), [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { resolveBackendUrl } from '../services/backendUrl';

export const SocketContext = createContext(null);

const socketUrl = resolveBackendUrl(import.meta.env.VITE_SOCKET_URL, 5000);

export const SocketProvider = ({ children }) => {
  const [socket] = useState(() => io(socketUrl, { autoConnect: false }));
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      socket.disconnect();
      return undefined;
    }

    socket.auth = { token };
    socket.connect();

    return () => socket.disconnect();
  }, [socket, token]);

  const value = useMemo(() => ({ socket }), [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

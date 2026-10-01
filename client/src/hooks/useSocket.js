import { useEffect } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    return () => socket.disconnect();
  }, []);

  return null;
};

export default useSocket;

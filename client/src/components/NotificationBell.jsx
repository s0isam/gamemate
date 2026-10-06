import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { getNotifications } from '../services/notificationService';

const NotificationBell = () => {
  const { socket } = useSocket();
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const response = await getNotifications();
      const unread = (response.data || []).filter((item) => !item.read).length;
      setCount(unread);
    } catch (error) {
      console.error('Unable to fetch notifications', error);
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleNewNotification = () => fetchCount();
    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
    };
  }, [socket, fetchCount]);

  return (
    <button className="relative rounded-xl border border-slate-700 bg-slate-900 p-2 text-lg text-slate-100 hover:border-brand-500">
      🔔
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;

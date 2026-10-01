import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { getTeamMessages, sendTeamMessage } from '../services/chatService';

const ChatBox = ({ teamId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!teamId) {
      return undefined;
    }

    const fetchMessages = async () => {
      setLoading(true);

      try {
        const response = await getTeamMessages(teamId);
        setMessages(response.data || []);
      } catch (error) {
        console.error('Unable to load team messages', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socketRef.current = socket;
    socket.emit('join-team', teamId);
    socket.on('team-message', (message) => {
      if (message.team === teamId || message.team?._id === teamId) {
        setMessages((prev) => {
          const exists = prev.some((item) => item._id === message._id);
          return exists ? prev : [...prev, message];
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [teamId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !teamId) {
      return;
    }

    try {
      const response = await sendTeamMessage(teamId, input.trim());
      setMessages((prev) => [...prev, response.data]);
      setInput('');
    } catch (error) {
      console.error('Unable to send message', error);
    }
  };

  return (
    <div className="card h-[420px] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Team Chat</h3>
        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-300">Online</span>
      </div>

      <div className="flex h-[280px] flex-col gap-3 overflow-y-auto rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200">
        {loading ? (
          <p className="text-slate-400">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-slate-400">No messages yet. Start the conversation.</p>
        ) : (
          messages.map((message) => {
            const isMine = message.sender?._id === user?._id || message.sender?.username === user?.username;
            return (
              <div key={message._id} className={isMine ? 'self-end' : 'self-start'}>
                <div className={`max-w-xs rounded-2xl px-3 py-2 ${isMine ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  {message.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500"
        />
        <button onClick={handleSend} className="rounded-xl bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-500">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

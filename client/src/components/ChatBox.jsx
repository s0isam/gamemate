import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getTeamMessages, sendTeamMessage } from '../services/chatService';

const formatMessageTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
};

const ChatBox = ({ teamId }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    let active = true;

    if (!teamId) {
      setMessages([]);
      setLoading(false);
      return () => { active = false; };
    }

    const fetchMessages = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getTeamMessages(teamId);
        if (active) setMessages(response.data || []);
      } catch (loadError) {
        console.error('Unable to load team messages', loadError);
        if (active) {
          setMessages([]);
          setError(loadError.response?.data?.message || 'Unable to load messages.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMessages();
    return () => { active = false; };
  }, [teamId]);

  useEffect(() => {
    if (!teamId || !socket) return undefined;

    socket.emit('join-team', String(teamId));

    const handleTeamMessage = (message) => {
      if (String(message.team?._id || message.team) === String(teamId)) {
        setMessages((prev) => (
          prev.some((item) => item._id === message._id) ? prev : [...prev, message]
        ));
      }
    };

    socket.on('team-message', handleTeamMessage);
    return () => socket.off('team-message', handleTeamMessage);
  }, [teamId, socket]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || !teamId || sending) return;

    setSending(true);
    setError('');
    try {
      const response = await sendTeamMessage(teamId, text);
      setMessages((prev) => (
        prev.some((item) => item._id === response.data._id) ? prev : [...prev, response.data]
      ));
      setInput('');
    } catch (sendError) {
      console.error('Unable to send message', sendError);
      setError(sendError.response?.data?.message || 'Message could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#313338]">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6">
        {loading ? (
          <p className="m-auto text-sm text-[#949ba4]">Loading messages...</p>
        ) : error && !messages.length ? (
          <p role="alert" className="m-auto text-sm text-red-300">{error}</p>
        ) : messages.length === 0 ? (
          <div className="mt-auto pb-5">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#404249] text-3xl font-light text-white">#</span>
            <h2 className="text-2xl font-bold text-white">Welcome to the squad chat!</h2>
            <p className="mt-2 text-sm text-[#b5bac1]">This is the beginning of your team conversation. Say hello!</p>
          </div>
        ) : (
          <div className="mt-auto space-y-5">
            {messages.map((message) => {
              const sender = message.sender || {};
              const senderId = sender._id || sender.id;
              const isMine = String(senderId || '') === String(user?._id || user?.id || '')
                || sender.username === user?.username;
              const username = sender.username || (isMine ? user?.username : null) || 'Unknown player';
              const time = formatMessageTime(message.createdAt);

              return (
                <article key={message._id} className="group flex gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5865f2] font-bold text-white">
                    {sender.profileImage ? <img src={sender.profileImage} alt="" className="h-full w-full object-cover" /> : username.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className={`font-semibold ${isMine ? 'text-brand-300' : 'text-white'}`}>{username}</span>
                      {time && <time className="text-[11px] text-[#949ba4]">{time}</time>}
                    </div>
                    <p className="whitespace-pre-wrap break-words text-[0.9375rem] leading-relaxed text-[#dbdee1]">{message.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSend} className="shrink-0 px-4 pb-5 sm:px-6">
        {error && messages.length > 0 && <p role="alert" className="mb-2 text-xs text-red-300">{error}</p>}
        <div className="flex items-end gap-3 rounded-lg bg-[#383a40] px-4 py-3 focus-within:ring-1 focus-within:ring-[#5865f2]">
          <label htmlFor="team-chat-message" className="sr-only">Message your squad</label>
          <textarea
            id="team-chat-message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend(event);
              }
            }}
            placeholder={`Message ${teamId ? 'your squad' : ''}`}
            rows={1}
            disabled={!teamId || sending}
            className="max-h-32 min-h-6 flex-1 resize-y border-0 bg-transparent p-0 text-sm text-white placeholder:text-[#949ba4] focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="shrink-0 rounded bg-[#5865f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#4752c4] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
        <p className="mt-2 px-1 text-[11px] text-[#949ba4]">Enter to send · Shift + Enter for a new line</p>
      </form>
    </div>
  );
};

export default ChatBox;

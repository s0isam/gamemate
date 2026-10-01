const ChatBox = () => {
  return (
    <div className="card h-[420px] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Team Chat</h3>
        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-300">Online</span>
      </div>

      <div className="flex h-[280px] flex-col gap-3 overflow-y-auto rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200">
        <div className="self-start rounded-2xl bg-slate-800 px-3 py-2">Hey team, ready to queue?</div>
        <div className="self-end rounded-2xl bg-brand-600 px-3 py-2 text-white">Yes! Let’s go.</div>
      </div>

      <div className="mt-4 flex gap-3">
        <input
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500"
        />
        <button className="rounded-xl bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-500">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

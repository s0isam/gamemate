const MyTeams = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">My Teams</h1>
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-white">Among Us Squad</h2>
        <p className="mt-2 text-slate-400">3 / 4 Players</p>
        <div className="mt-5 flex gap-3">
          <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm text-white">Chat</button>
          <button className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white">Share Lobby Code</button>
          <button className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">Leave Team</button>
        </div>
      </div>
    </div>
  );
};

export default MyTeams;

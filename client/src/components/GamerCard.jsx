import { Link } from 'react-router-dom';

const GamerCard = ({ gamer, onRequest }) => {
  const { username, games = [], preferredLanguages = [], gamingStatus = 'Looking for Team', distance = 'Nearby', microphoneAvailable } = gamer || {};

  const statusClass = gamingStatus?.toLowerCase().includes('offline') ? 'text-slate-300 border-slate-600 bg-slate-800/80' : 'text-brand-300 border-brand-400/50 bg-brand-400/10';

  return (
    <article className="card p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-brand-400/70 hover:shadow-[0_0_18px_rgba(223,255,0,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center border border-[#ff1744]/60 bg-[#111111] text-lg font-black text-[#ffd2da] shadow-[0_0_18px_rgba(255,23,68,0.18)]">
            {username?.slice(0, 1).toUpperCase() || 'G'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              <Link to={`/gamer/${gamer._id}`} className="hover:text-brand-300">{username}</Link>
            </h3>
            <p className="mono mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">{games[0] || 'No games listed'}</p>
          </div>
        </div>
        <span className={`status-pill border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${statusClass}`}>
          {gamingStatus}
        </span>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-slate-300">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400">Status</span>
          <span className="font-medium text-white">{distance} away</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400">Languages</span>
          <span className="font-medium text-white">{preferredLanguages.length ? preferredLanguages.join(', ') : 'Not listed'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Mic</span>
          <span className="font-medium text-white">{microphoneAvailable ? 'Available' : 'Not listed'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Rank / skill</span>
          <span className="font-medium text-white">{gamer.skillLevel || 'Not listed'}</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link
          to={`/gamer/${gamer._id}`}
          className="flex items-center justify-center border border-slate-600 bg-slate-900 px-3 py-3 text-center text-[10px] font-black uppercase tracking-[0.14em] text-white transition-colors hover:border-brand-400 hover:text-brand-300"
        >
          View Profile
        </Link>
        <button
          type="button"
          onClick={() => onRequest?.(gamer)}
          className="border border-brand-400 bg-brand-400 px-3 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-black hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(223,255,0,0.35)]"
        >
          Invite
        </button>
      </div>
    </article>
  );
};

export default GamerCard;

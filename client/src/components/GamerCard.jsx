const GamerCard = ({ gamer, onRequest }) => {
  const { username, games = ['Among Us'], preferredLanguages = ['English'], gamingStatus = 'Looking for Team', distance = '2.4 km' } = gamer || {};

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{username}</h3>
          <p className="text-sm text-slate-400">{games[0]}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
          {gamingStatus}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <p>{distance} away</p>
        <p>{preferredLanguages[0]}</p>
        <p>🎤 Mic available</p>
      </div>

      <button
        type="button"
        onClick={() => onRequest?.(gamer)}
        className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-500"
      >
        Request to Team Up
      </button>
    </article>
  );
};

export default GamerCard;

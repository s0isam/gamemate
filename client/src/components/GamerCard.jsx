import { Link } from 'react-router-dom';

const GamerCard = ({ gamer, onRequest }) => {
  const { username, games = [], preferredLanguages = [], gamingStatus = 'Looking for Team', distance = 'Nearby', microphoneAvailable } = gamer || {};

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            <Link to={`/gamer/${gamer._id}`} className="hover:text-brand-300">{username}</Link>
          </h3>
          <p className="text-sm text-slate-400">{games[0] || 'No games listed'}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
          {gamingStatus}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <p>{distance} away</p>
        <p>{preferredLanguages.length ? preferredLanguages.join(', ') : 'No languages listed'}</p>
        <p>{microphoneAvailable ? 'Microphone available' : 'No microphone listed'}</p>
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

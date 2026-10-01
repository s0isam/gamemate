const TeamRequestCard = ({ request, onAccept, onReject }) => {
  const senderName = request?.sender?.username || request?.sender || 'Player';
  const gameName = request?.game || 'a game';

  return (
    <article className="card p-4">
      <p className="text-sm text-slate-300">
        {senderName} wants to team up with you for {gameName}.
      </p>
      {request?.message && <p className="mt-2 text-sm text-slate-400">“{request.message}”</p>}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onAccept?.(request)}
          className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => onReject?.(request)}
          className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:border-slate-500"
        >
          Reject
        </button>
      </div>
    </article>
  );
};

export default TeamRequestCard;

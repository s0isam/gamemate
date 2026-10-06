const TeamRequestCard = ({ request, onAccept, onReject, direction = 'incoming', showActions = true }) => {
  const playerName = direction === 'incoming'
    ? request?.sender?.username || request?.sender || 'Player'
    : request?.receiver?.username || request?.receiver || 'Player';
  const gameName = request?.game || 'a game';

  return (
    <article className="card p-4">
      <p className="text-sm text-slate-300">
        {direction === 'incoming'
          ? `${playerName} wants to team up with you for ${gameName}.`
          : `You invited ${playerName} to team up for ${gameName}.`}
      </p>
      {request?.message && <p className="mt-2 text-sm text-slate-400">“{request.message}”</p>}
      {showActions ? <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onAccept?.(request)}
          className="rounded-xl border border-brand-400 bg-brand-400 px-3 py-2 text-sm font-bold text-black hover:bg-brand-300"
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
      </div> : <p className="mt-3 text-xs font-medium capitalize text-slate-500">Status: {request.status}</p>}
    </article>
  );
};

export default TeamRequestCard;

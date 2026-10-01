const TeamRequestCard = ({ request }) => {
  return (
    <article className="card p-4">
      <p className="text-sm text-slate-300">
        {request?.sender || 'Rahul'} wants to team up with you for {request?.game || 'Among Us'}.
      </p>
      <div className="mt-4 flex gap-3">
        <button className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500">
          Accept
        </button>
        <button className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:border-slate-500">
          Reject
        </button>
      </div>
    </article>
  );
};

export default TeamRequestCard;

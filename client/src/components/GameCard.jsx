const GameCard = ({ name, description, category, image }) => {
  return (
    <article className="card flex h-full flex-col p-4 transition-transform duration-200 hover:-translate-y-1 hover:border-brand-400/70 hover:shadow-[0_0_20px_rgba(223,255,0,0.1)]">
      <div className="mb-4 flex h-32 items-center justify-center border border-brand-400/50 bg-[linear-gradient(135deg,rgba(223,255,0,0.22),rgba(255,23,68,0.08),rgba(17,17,17,0.8))] text-2xl font-black text-brand-300">
        {image || name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{category}</p>
          <h3 className="mt-2 text-xl font-bold text-white">{name}</h3>
        </div>
        <button className="border border-brand-400 bg-brand-400 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black hover:shadow-[0_0_18px_rgba(223,255,0,0.35)]">
          Explore
        </button>
      </div>
      <p className="mt-4 text-sm text-slate-300">{description}</p>
    </article>
  );
};

export default GameCard;

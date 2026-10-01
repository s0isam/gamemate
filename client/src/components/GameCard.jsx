const GameCard = ({ name, description, category, image }) => {
  return (
    <article className="card overflow-hidden p-4">
      <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-500 text-2xl font-bold text-white">
        {image || name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-sm text-slate-400">{category}</p>
        </div>
        <button className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-500">
          Explore
        </button>
      </div>
      <p className="mt-3 text-sm text-slate-300">{description}</p>
    </article>
  );
};

export default GameCard;

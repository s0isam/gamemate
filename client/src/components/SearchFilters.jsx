const SearchFilters = ({ filters, setFilters, onSubmit, games = [] }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="card p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Game</span>
          <select
            value={filters.game}
            onChange={(event) => handleChange('game', event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500"
          >
            <option value="">Any Game</option>
            {games.map((game) => (
              <option key={game.name} value={game.name}>
                {game.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Radius</span>
          <input
            type="number"
            min="1"
            max="50"
            value={filters.radius}
            onChange={(event) => handleChange('radius', event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Language</span>
          <select
            value={filters.language}
            onChange={(event) => handleChange('language', event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500"
          >
            <option value="">Any</option>
            <option value="English">English</option>
            <option value="Telugu">Telugu</option>
            <option value="Hindi">Hindi</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Microphone</span>
          <select
            value={filters.microphone}
            onChange={(event) => handleChange('microphone', event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500"
          >
            <option value="">Any</option>
            <option value="true">Required</option>
            <option value="false">Not Required</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Skill</span>
          <select
            value={filters.skillLevel}
            onChange={(event) => handleChange('skillLevel', event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500"
          >
            <option value="">Any</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Pro">Pro</option>
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onSubmit}
            className="w-full rounded-xl bg-brand-600 px-4 py-2.5 font-bold text-black hover:bg-brand-500"
          >
            Find Gamers
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;

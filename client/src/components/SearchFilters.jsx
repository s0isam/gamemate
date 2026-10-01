const SearchFilters = () => {
  return (
    <div className="card p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Game</span>
          <select className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500">
            <option>Among Us</option>
            <option>Valorant</option>
            <option>Fortnite</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Players Needed</span>
          <input defaultValue={2} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500" />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Radius</span>
          <input defaultValue={10} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500" />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Language</span>
          <select className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500">
            <option>Telugu</option>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span>Skill</span>
          <select className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500">
            <option>Any</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default SearchFilters;

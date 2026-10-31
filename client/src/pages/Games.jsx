import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { getGames } from '../services/gameService';

const Games = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const normalizedSearch = search.trim().toLowerCase();

  useEffect(() => {
    let active = true;

    const loadGames = async () => {
      try {
        const response = await getGames();
        if (active) setGames(response.data || []);
      } catch (loadError) {
        if (active) setError(loadError.response?.data?.message || 'Unable to load games right now.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadGames();
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(games.map((game) => game.category).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second)),
    [games]
  );
  const filteredGames = useMemo(() => games.filter((game) => {
    const matchesSearch = !normalizedSearch || [
      game.name,
      game.category,
      game.description,
    ].some((value) => value?.toLowerCase().includes(normalizedSearch));
    return matchesSearch && (!category || game.category === category);
  }), [games, normalizedSearch, category]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="space-y-8">
      <header className="border-b border-[#30303A] pb-6">
        <p className="mono text-xs uppercase tracking-[0.24em] text-brand-300">Game directory</p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">Find your game.</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Choose a title to find nearby players who are ready to team up.</p>
      </header>

      <section className="card p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.45fr)_auto] sm:items-end">
          <label className="space-y-2 text-sm text-slate-300">
            <span>Search games</span>
            <input
              type="search"
              value={search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Title, genre, or description"
              className="w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>Genre</span>
            <select
              value={category}
              onChange={(event) => updateFilter('category', event.target.value)}
              className="w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="">All genres</option>
              {categories.map((gameCategory) => (
                <option key={gameCategory} value={gameCategory}>{gameCategory}</option>
              ))}
            </select>
          </label>
          {(search || category) && (
            <Link
              to="/games"
              className="inline-flex min-h-10 items-center justify-center border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-brand-400 hover:text-brand-300"
            >
              Clear filters
            </Link>
          )}
        </div>
        {!loading && (
          <p className="mt-4 text-sm text-slate-400" aria-live="polite">
            {filteredGames.length} game{filteredGames.length === 1 ? '' : 's'} found
          </p>
        )}
      </section>

      {error && <p role="alert" className="border border-danger-500/40 bg-danger-500/10 p-4 text-sm text-red-200">{error}</p>}
      {loading ? (
        <p className="text-slate-300">Loading games...</p>
      ) : filteredGames.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredGames.map((game) => (
            <GameCard key={game._id || game.name} {...game} />
          ))}
        </div>
      ) : !error ? (
        <section className="card p-6">
          <h2 className="text-xl font-bold text-white">No games found</h2>
          <p className="mt-2 text-sm text-slate-400">Try a different search, or browse all available games.</p>
          <Link to="/games" className="mt-4 inline-flex text-sm font-semibold text-brand-300 hover:text-white">Show all games</Link>
        </section>
      ) : null}
    </div>
  );
};

export default Games;

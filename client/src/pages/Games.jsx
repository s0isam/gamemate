import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { getGames } from '../services/gameService';

const Games = () => {
  const [searchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const search = (searchParams.get('search') || '').trim().toLowerCase();

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

  const filteredGames = useMemo(
    () => games.filter((game) => game.name.toLowerCase().includes(search)),
    [games, search]
  );

  return (
    <div className="space-y-8">
      <header className="border-b border-[#302a3e] pb-6">
        <p className="mono text-xs uppercase tracking-[0.24em] text-brand-300">Game directory</p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">Find your game.</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Choose a title to find nearby players who are ready to team up.</p>
      </header>

      {search && (
        <p className="text-sm text-slate-400">
          Results for <span className="font-semibold text-white">“{searchParams.get('search')}”</span>
          {' · '}
          <Link to="/games" className="text-brand-300 hover:text-white">Clear search</Link>
        </p>
      )}

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

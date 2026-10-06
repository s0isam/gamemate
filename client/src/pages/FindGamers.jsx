import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import GamerCard from '../components/GamerCard';
import { getNearbyGamers } from '../services/gamerService';
import { sendTeamRequest } from '../services/teamService';
import { getGames } from '../services/gameService';

const getActivityPosition = (index) => {
  const angle = index * 2.399;
  const radius = 12 + (index % 6) * 5;
  return {
    left: `${50 + Math.cos(angle) * radius}%`,
    top: `${50 + Math.sin(angle) * radius}%`,
  };
};

const defaultFilters = {
  game: '',
  radius: '10',
  language: '',
  microphone: '',
  skillLevel: '',
};

const FindGamers = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    game: searchParams.get('game') || '',
  }));
  const [gamers, setGamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [gamesError, setGamesError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [requestFeedback, setRequestFeedback] = useState('');

  const handleRequest = async (gamer) => {
    setRequestFeedback('');
    try {
      const game = filters.game || gamer.games?.[0] || 'Among Us';
      const payload = {
        receiverId: gamer._id,
        game,
        message: `Hi ${gamer.username}, I want to squad up for ${game}.`,
      };

      await sendTeamRequest(payload);
      setRequestFeedback(`Invite sent to ${gamer.username}.`);
    } catch (error) {
      console.error('Failed to send request', error);
      setRequestFeedback(error.response?.data?.message || 'Unable to send the team request right now.');
    }
  };

  const loadGamers = async (nextFilters = filters) => {
    setLoading(true);
    setLoadError('');

    try {
      const response = await getNearbyGamers({
        ...nextFilters,
        radius: nextFilters.radius || 10,
      });
      setGamers(response.data || []);
    } catch (error) {
      console.error('Unable to load nearby gamers', error);
      setGamers([]);
      setLoadError(error.response?.data?.message || 'Unable to load nearby gamers. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGamers();
  }, []);

  useEffect(() => {
    let active = true;
    getGames()
      .then((response) => {
        if (active) setGames(response.data || []);
      })
      .catch((error) => {
        if (active) setGamesError(error.response?.data?.message || 'Unable to load game filters.');
      });

    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-8">
      <section className="text-center">
        <p className="mono text-xs uppercase tracking-[0.24em] text-brand-300">Live player discovery</p>
        <h1 className="text-4xl font-black text-white">Find Your Gaming Squad</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">Filter real nearby player profiles, check their game and availability, then invite them to team up.</p>
      </section>

      <SearchFilters filters={filters} setFilters={setFilters} onSubmit={() => loadGamers(filters)} games={games} />
      {gamesError && <p role="alert" className="border border-danger-500/40 bg-danger-500/10 px-4 py-3 text-sm text-red-200">{gamesError}</p>}

      <div className="mt-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Area activity</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Nearby Gamers</h2>
          </div>
          {!loading && <p className="text-sm text-slate-400">{gamers.length} player{gamers.length === 1 ? '' : 's'} found</p>}
        </div>

        {requestFeedback && <p role="status" className="mb-4 border border-[#ff1744]/35 bg-[#ff1744]/10 px-4 py-3 text-sm text-red-200">{requestFeedback}</p>}
        {loadError && <p role="alert" className="mb-4 border border-danger-500/40 bg-danger-500/10 px-4 py-3 text-sm text-red-200">{loadError}</p>}

        <section className="relative mb-8 min-h-64 overflow-hidden border border-[#30291f] bg-[#0b0b0b] p-5 sm:p-7" aria-label="Approximate nearby player activity">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage: 'linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.08),transparent_55%)]" />
          <div className="relative flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mono text-xs uppercase tracking-[0.18em] text-[#C4A3FF]">Squad signal grid</p>
              <p className="mt-1 text-sm text-slate-300">Approximate player activity · exact locations are never shown</p>
            </div>
            <div className="flex gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.5)]" />Available</span>
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 bg-danger-500 shadow-[0_0_8px_rgba(255,23,68,0.5)]" />In game</span>
            </div>
          </div>
          <div className="relative mt-5 h-48 border-y border-[#28231c]/80 sm:h-56">
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 border border-brand-400/20" />
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 border border-[#ff1744]/25" />
            {gamers.map((gamer, index) => {
              const point = getActivityPosition(index);
              const inGame = gamer.gamingStatus?.toLowerCase().includes('in game');
              return (
                <Link
                  key={gamer._id || gamer.username}
                  to={`/gamer/${gamer._id}`}
                  title={`${gamer.username || 'Player'} · ${gamer.distanceLabel || 'Nearby'}`}
                  aria-label={`Open ${gamer.username || 'player'} profile, ${gamer.distanceLabel || 'nearby'}`}
                  className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border text-[10px] font-bold text-black transition-transform hover:z-10 hover:scale-125 ${inGame ? 'border-danger-500 bg-danger-500' : 'border-neon-green bg-neon-green'}`}
                  style={{ left: point.left, top: point.top }}
                >
                  {gamer.username?.slice(0, 1).toUpperCase() || 'G'}
                </Link>
              );
            })}
            {!loading && gamers.length === 0 && (
              <p className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-slate-500">
                No player signals in this search area. Adjust filters or update your location in Settings.
              </p>
            )}
          </div>
          <p className="relative mt-3 text-[11px] text-slate-500">Grid positions are illustrative, not geographic. Distances are approximate.</p>
        </section>

        {loading ? (
          <div className="text-slate-300">Loading nearby players...</div>
        ) : gamers.length === 0 ? (
          <div className="card p-6 text-slate-300">No nearby gamers matched your filters yet. Try a wider radius or a different game.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {gamers.map((gamer) => (
              <GamerCard
                key={gamer._id || gamer.username}
                gamer={{ ...gamer, distance: gamer.distanceLabel || 'Nearby' }}
                onRequest={handleRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindGamers;

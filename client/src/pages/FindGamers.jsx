import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import GamerCard from '../components/GamerCard';
import { getNearbyGamers } from '../services/gamerService';
import { sendTeamRequest } from '../services/teamService';

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

  const handleRequest = async (gamer) => {
    try {
      const payload = {
        receiverId: gamer._id,
        game: gamer.games?.[0] || filters.game || 'Among Us',
        message: `Hi ${gamer.username}, I want to squad up for ${gamer.games?.[0] || 'this game'}.`,
      };

      await sendTeamRequest(payload);
      window.alert(`Team request sent to ${gamer.username}.`);
    } catch (error) {
      console.error('Failed to send request', error);
      window.alert('Unable to send the team request right now.');
    }
  };

  const loadGamers = async (nextFilters = filters) => {
    setLoading(true);

    try {
      const response = await getNearbyGamers({
        ...nextFilters,
        radius: nextFilters.radius || 10,
      });
      setGamers(response.data || []);
    } catch (error) {
      console.error('Unable to load nearby gamers', error);
      setGamers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGamers();
  }, []);

  useEffect(() => {
    setGames([
      { name: 'Among Us' },
      { name: 'Valorant' },
      { name: 'Fortnite' },
      { name: 'BGMI' },
      { name: 'PUBG' },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-black text-white">Find Your Gaming Squad</h1>
      </section>

      <SearchFilters filters={filters} setFilters={setFilters} onSubmit={() => loadGamers(filters)} games={games} />

      <div className="mt-8">
        <h2 className="mb-5 text-2xl font-bold text-white">Nearby Gamers</h2>

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

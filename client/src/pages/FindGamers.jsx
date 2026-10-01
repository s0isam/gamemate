import SearchFilters from '../components/SearchFilters';
import GamerCard from '../components/GamerCard';

const gamers = [
  { username: 'Rahul', games: ['Among Us'], preferredLanguages: ['Telugu'], gamingStatus: 'Looking for Team', distance: '2.4 km' },
  { username: 'Arjun', games: ['Among Us'], preferredLanguages: ['English'], gamingStatus: 'Looking for Team', distance: '5.7 km' },
];

const FindGamers = () => {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-black text-white">Find Your Gaming Squad</h1>
      </section>

      <SearchFilters />

      <div className="mt-8">
        <h2 className="mb-5 text-2xl font-bold text-white">Nearby Gamers</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {gamers.map((gamer) => (
            <GamerCard key={gamer.username} gamer={gamer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindGamers;

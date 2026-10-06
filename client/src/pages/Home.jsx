import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';

const games = [
  { name: 'Among Us', category: 'Social Strategy', description: 'Quick matches, teamwork, and intense bluffing rounds.' },
  { name: 'Valorant', category: 'Tactical Shooter', description: 'Coordinate with your squad and outplay the enemy team.' },
  { name: 'Fortnite', category: 'Battle Royale', description: 'Build, loot, and survive with your perfect duo or squad.' },
  { name: 'BGMI', category: 'Battle Arena', description: 'Find reliable friends for ranked pushes and scrims.' },
];

const Home = () => {
  return (
    <div className="space-y-16 pb-10">
      <section className="grid items-center gap-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-soft lg:grid-cols-2 lg:p-12">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-sm text-brand-200">
            Find your squad. Play together.
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Find Your Squad.
            <span className="block text-brand-400">Play Together.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Connect with gamers around you, find teammates for your favorite games, and start playing.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/find-gamers" className="rounded-xl bg-brand-600 px-6 py-3 font-bold text-black hover:bg-brand-500">
              Find Gamers
            </Link>
            <Link to="/" className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-slate-100 hover:border-brand-500">
              Explore Games
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <p className="text-sm text-slate-400">Nearby Players</p>
            <p className="mt-3 text-4xl font-bold text-white">1.2k</p>
            <p className="mt-1 text-sm text-brand-300">+18% this week</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-slate-400">Active Teams</p>
            <p className="mt-3 text-4xl font-bold text-white">480</p>
            <p className="mt-1 text-sm text-brand-300">Across 12 games</p>
          </div>
          <div className="card p-5 sm:col-span-2">
            <p className="text-sm text-slate-400">Players online now</p>
            <div className="mt-4 flex -space-x-2">
              {['R', 'A', 'N', 'S'].map((letter, index) => (
                <div key={index} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-brand-600 text-sm font-bold text-black">
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Popular games</h2>
          <Link className="text-sm text-brand-300" to="/find-gamers">Browse all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.name} {...game} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ['1', 'Set your game and filters', 'Choose your favorite title, language, microphone preference, and skill level.'],
          ['2', 'Find nearby gamers', 'Match with players close to your current location and check their online status.'],
          ['3', 'Send requests & play', 'Invite the right teammate and build a team quickly before your next match starts.'],
        ].map(([step, title, text]) => (
          <div key={step} className="card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 font-bold text-black">{step}</div>
            <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-300">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { getGames } from '../services/gameService';

const Home = () => {
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState('');

  useEffect(() => {
    let active = true;

    getGames()
      .then((response) => {
        if (active) setGames(response.data || []);
      })
      .catch((error) => {
        if (active) setGamesError(error.response?.data?.message || 'Unable to load games from the server.');
      })
      .finally(() => {
        if (active) setGamesLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-16 pb-10">
      <section className="grid items-center gap-8 rounded-none border border-[#514a23] bg-[#11151C]/95 p-8 shadow-[0_0_0_1px_rgba(255,230,0,0.12),0_0_22px_rgba(255,230,0,0.12)] lg:grid-cols-[1.55fr_1fr] lg:p-10 xl:p-12">
        <div className="max-w-[720px]">
          <p className="mb-5 inline-flex border border-[#FFE600]/40 bg-[#171B24] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#FFE600]">
            Nearby players. Your next squad.
          </p>
          <h1 className="text-[3.1rem] font-black uppercase leading-[0.94] tracking-[-0.06em] text-white md:text-[5.1rem]">
            Find Your Next
            <span className="radiant-red block">Squad.</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-xl leading-8 text-slate-300">
            Gamers around you. Games you play. Teams you can join.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/find-gamers" className="inline-flex items-center justify-center rounded-[10px] bg-brand-600 px-7 py-4 text-base font-bold text-white shadow-[0_0_18px_rgba(255,230,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-500">
              Find Gamers Near Me
            </Link>
            <Link to="/my-teams" className="inline-flex items-center justify-center rounded-[10px] border border-white/40 bg-[#171717] px-7 py-4 text-base font-medium text-white transition-all duration-200 hover:border-brand-400 hover:text-brand-300">
              Create a Squad
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-none border border-[#514a23] bg-[#171B24] p-5 shadow-[inset_0_0_0_1px_rgba(255,230,0,0.10)]">
            <p className="mono text-xs uppercase tracking-[0.16em] text-slate-400">01 / Discover</p>
            <p className="mt-4 text-xl font-bold text-white">Players nearby</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Find teammates by game, distance, skill and availability.</p>
          </div>
          <div className="rounded-none border border-[#514a23] bg-[#171B24] p-5 shadow-[inset_0_0_0_1px_rgba(255,230,0,0.10)]">
            <p className="mono text-xs uppercase tracking-[0.16em] text-slate-400">02 / Squad up</p>
            <p className="mt-4 text-xl font-bold text-white">Build your team</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Invite players, manage your lobby and keep the conversation going.</p>
          </div>
          <div className="rounded-none border border-[#514a23] bg-[#171B24] p-5 sm:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="mono text-xs uppercase tracking-[0.16em] text-[#00A8FF]">Privacy first</p>
                <p className="mt-2 text-sm text-slate-300">Nearby discovery uses approximate distance. Exact locations stay private.</p>
              </div>
              <span aria-hidden="true" className="hidden h-10 w-10 shrink-0 items-center justify-center border border-[#00A8FF]/50 text-[#00A8FF] sm:flex">◎</span>
            </div>
          </div>
        </div>
      </section>

      <section id="popular-games" className="scroll-mt-24">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-4xl font-black tracking-[-0.05em] text-white">Popular games</h2>
          <Link className="radiant-red text-sm font-semibold transition-opacity hover:opacity-80" to="/games">Browse all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {gamesLoading ? (
            <p className="text-sm text-slate-400">Loading games...</p>
          ) : gamesError ? (
            <p role="alert" className="border border-danger-500/40 bg-danger-500/10 px-4 py-3 text-sm text-red-200">{gamesError}</p>
          ) : games.length ? (
            games.map((game) => <GameCard key={game._id || game.name} {...game} />)
          ) : (
            <p className="text-sm text-slate-400">No games are available yet.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ['1', 'Set your game and filters', 'Choose your favorite title, language, microphone preference, and skill level.'],
          ['2', 'Find nearby gamers', 'Match with players close to your current location and check their online status.'],
          ['3', 'Send requests & play', 'Invite the right teammate and build a team quickly before your next match starts.'],
        ].map(([step, title, text]) => (
          <div key={step} className="relative overflow-hidden rounded-none border border-[#30303A] bg-[#11151C] p-6 shadow-[inset_0_1px_0_rgba(255,230,0,0.08)] transition-all duration-200 hover:-translate-y-1 hover:border-[#FFE600]/50">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-none border border-[#FFE600]/60 bg-[#FFE600] font-bold text-[#080A0F] shadow-[0_0_16px_rgba(255,230,0,0.18)]">{step}</div>
            <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
            <p className="text-sm leading-6 text-slate-300">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;

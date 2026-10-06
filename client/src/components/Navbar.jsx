import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const navItems = [
    { to: '/games', label: 'Discover' },
    { to: '/find-gamers', label: 'Nearby' },
    ...(user ? [
      { to: '/my-teams', label: 'Squads' },
      { to: '/chat', label: 'Messages' },
    ] : []),
  ];

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/games?search=${encodeURIComponent(query)}` : '/games');
    setSearch('');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#221b19] bg-[#050505]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="logo-mark inline-flex h-10 w-10 items-center justify-center border border-[#ff1744] bg-[#111111] text-lg font-black text-[#ffd2da] shadow-[0_0_18px_rgba(255,23,68,0.35)]">
            G
          </span>
          <div className="leading-none">
            <span className="radiant-red block text-lg font-black tracking-tight">GameMate</span>
            <span className="mono block text-[10px] uppercase tracking-[0.28em] text-slate-400">Squad network</span>
          </div>
        </Link>

        <form onSubmit={handleSearch} role="search" className="order-3 flex w-full lg:order-none lg:w-auto lg:flex-1 lg:max-w-xs">
          <label className="sr-only" htmlFor="global-search">Search games</label>
          <input
            id="global-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games..."
            className="min-w-0 w-full border border-[#2d2d2d] bg-[#111111] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-400"
          />
          <button type="submit" className="border border-l-0 border-[#2d2d2d] bg-[#171717] px-3 text-xs font-bold uppercase tracking-wider text-brand-300 hover:border-brand-400 hover:text-brand-200">
            Search
          </button>
        </form>

        <nav className="hidden items-center gap-1 border border-[#2b2b2b] bg-[#111111]/80 p-1 lg:flex">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-all ${
                  isActive
                    ? 'bg-[#dfff00] text-black shadow-[0_0_18px_rgba(223,255,0,0.35)]'
                    : 'text-slate-300 hover:text-brand-300'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          {user && (
            <>
              <NotificationBell />
              <Link to={`/gamer/${user._id}`} aria-label="View your profile" className="flex h-10 w-10 items-center justify-center overflow-hidden border border-[#ff1744]/50 bg-[#171717] font-bold text-[#ffd2da] hover:border-[#ff1744]">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
                ) : user.username?.charAt(0)?.toUpperCase() || 'G'}
              </Link>
            </>
          )}
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-[8px] border border-[#2d2d2d] bg-[#121212] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#dfff00] hover:text-[#dfff00]"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-[8px] border border-[#dfff00] bg-[#dfff00] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black shadow-[0_0_18px_rgba(223,255,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f4ff00]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="flex items-center gap-1 overflow-x-auto border-t border-[#1c1c1c] px-3 py-2 lg:hidden">
        <NavLink to="/" className={({ isActive }) => `shrink-0 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-brand-300' : 'text-slate-400'}`}>Home</NavLink>
        {navItems.map(({ to, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `shrink-0 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-brand-300' : 'text-slate-400'}`}>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;

import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const showNotifications = pathname !== '/find-gamers' && pathname !== '/notifications';

  const navItems = [
    { to: '/games', label: 'Discover' },
    { to: '/find-gamers', label: 'Nearby' },
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard' },
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

  const navLinkClass = ({ isActive }) => (
    `shrink-0 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${
      isActive
        ? 'bg-brand-500/15 text-brand-300'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
    }`
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/70 bg-[#0B0E13]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:gap-x-6 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3 text-white">
          <span className="logo-mark inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-400/50 bg-slate-900 text-xs font-black text-brand-200 sm:h-10 sm:w-10 sm:text-sm">
            G
          </span>
          <div className="leading-tight">
            <span className="radiant-primary block text-base font-extrabold tracking-tight">GameMate</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">Squad network</span>
          </div>
        </Link>

        <form onSubmit={handleSearch} role="search" className="order-3 flex w-full min-w-0 xl:order-none xl:w-auto xl:max-w-xs xl:flex-1">
          <label className="sr-only" htmlFor="global-search">Search games</label>
          <input
            id="global-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games..."
            className="min-w-0 w-full rounded-l-lg border border-r-0 border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-400"
          />
          <button type="submit" className="rounded-r-lg border border-slate-700 bg-slate-800 px-4 text-xs font-bold text-slate-200 hover:border-brand-400 hover:text-brand-200">
            Search
          </button>
        </form>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'light'}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:border-brand-400 hover:text-brand-300"
          >
            <span className="sm:hidden" aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          {user && (
            <>
              {showNotifications && <span className="hidden sm:block"><NotificationBell /></span>}
              <Link to={`/gamer/${user._id}`} aria-label="View your profile" className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-600 bg-slate-800 font-bold text-brand-200 hover:border-brand-400 sm:h-10 sm:w-10">
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
              aria-label="Sign out"
              className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-brand-400 hover:text-brand-300 sm:px-4"
            >
              <span className="sm:hidden">Out</span>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-brand-400"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="flex items-center gap-1 overflow-x-auto border-t border-slate-800 px-3 py-2 xl:hidden">
        <NavLink to="/" className={navLinkClass}>Home</NavLink>
        {navItems.map(({ to, label }) => (
          <NavLink key={to} to={to} className={navLinkClass}>
            {label}
          </NavLink>
        ))}
        {user && <NavLink to="/notifications" className={navLinkClass}>Alerts</NavLink>}
      </nav>
    </header>
  );
};

export default Navbar;

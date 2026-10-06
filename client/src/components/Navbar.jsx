import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/find-gamers', label: 'Find Gamers' },
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/my-teams', label: 'My Teams' },
      { to: `/gamer/${user._id}`, label: 'My Profile' },
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070707]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="logo-mark inline-flex h-10 w-10 items-center justify-center border border-brand-400 bg-brand-400 text-lg font-black text-black shadow-[0_0_18px_rgba(223,255,0,0.35)]">
            G
          </span>
          <div className="leading-none">
            <span className="block text-lg font-black tracking-tight">GameMate</span>
            <span className="mono block text-[10px] uppercase tracking-[0.28em] text-slate-400">Squad network</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-800 bg-slate-950/70 p-1 md:flex">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-all ${
                  isActive
                    ? 'bg-brand-400 text-black shadow-[0_0_18px_rgba(223,255,0,0.35)]'
                    : 'text-slate-300 hover:border-slate-700 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user && <NotificationBell />}
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-none border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-300"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-none border border-brand-400 bg-brand-400 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(223,255,0,0.35)]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

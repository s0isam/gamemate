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
    <header className="sticky top-0 z-50 border-b border-[#221b19] bg-[#050505]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="logo-mark inline-flex h-10 w-10 items-center justify-center border border-[#dfff00] bg-[#dfff00] text-lg font-black text-black shadow-[0_0_18px_rgba(223,255,0,0.35)]">
            G
          </span>
          <div className="leading-none">
            <span className="block text-lg font-black tracking-tight">GameMate</span>
            <span className="mono block text-[10px] uppercase tracking-[0.28em] text-slate-400">Squad network</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[#2b2b2b] bg-[#111111]/80 p-1 md:flex">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-all ${
                  isActive
                    ? 'bg-[#dfff00] text-black shadow-[0_0_18px_rgba(223,255,0,0.35)]'
                    : 'text-slate-300 hover:text-white'
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
    </header>
  );
};

export default Navbar;

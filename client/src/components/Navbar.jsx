import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg shadow-lg shadow-brand-600/30">
            G
          </span>
          GameMate
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link to="/">Home</Link>
          <Link to="/find-gamers">Find Gamers</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/my-teams">My Teams</Link>
        </nav>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link
            to="/login"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:border-brand-500"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTeams, getTeamRequests } from '../services/teamService';

const getTeamSize = (team) => new Set([
  team.leader?._id || team.leader,
  ...(team.members || []).map((member) => member._id || member),
].filter(Boolean)).size;

const Dashboard = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const [teamResponse, requestResponse] = await Promise.all([
          getMyTeams(),
          getTeamRequests(),
        ]);
        if (!active) return;

        setTeams(teamResponse.data || []);
        setIncomingRequests(
          (requestResponse.data || []).filter(
            (request) => request.status === 'pending' && request.receiver?._id === user._id
          )
        );
      } catch (loadError) {
        if (active) setError(loadError.response?.data?.message || 'Could not load your dashboard. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();
    return () => { active = false; };
  }, [user?._id]);

  const profileItems = [
    Boolean(user?.bio),
    Boolean(user?.games?.length),
    Boolean(user?.preferredLanguages?.length),
    Boolean(user?.skillLevel),
  ];
  const profileProgress = Math.round((profileItems.filter(Boolean).length / profileItems.length) * 100);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Player hub</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Welcome back, <span className="radiant-red">{user?.username || 'Gamer'}</span></h1>
            <p className="mt-2 max-w-xl text-slate-400">Your squads, invitations, and profile are all in one place.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/find-gamers" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-black hover:bg-brand-500">
                Find teammates
              </Link>
              <Link to="/my-teams" className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:border-slate-500">
                Open my teams
              </Link>
            </div>
          </div>
          <Link to={`/gamer/${user?._id}`} className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/70 p-3 hover:border-brand-500">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="" className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-black">
                {user?.username?.charAt(0)?.toUpperCase() || 'G'}
              </span>
            )}
            <span className="text-left">
              <span className="block text-sm font-semibold text-white">View your profile</span>
              <span className="block text-xs text-slate-400">Profile {profileProgress}% complete</span>
            </span>
          </Link>
        </div>
      </section>

      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="card p-5">
          <p className="text-sm text-slate-400">Favorite game</p>
          <h2 className="mt-2 text-xl font-bold text-white">{user?.games?.[0] || 'Add a game'}</h2>
          <Link to="/settings" className="mt-4 inline-flex text-sm font-medium text-brand-300 hover:text-white">Update profile</Link>
        </article>
        <article className="card p-5">
          <p className="text-sm text-slate-400">Availability</p>
          <h2 className="mt-2 text-xl font-bold text-brand-300">{user?.gamingStatus || 'Online'}</h2>
          <Link to="/settings" className="mt-4 inline-flex text-sm font-medium text-brand-300 hover:text-white">Change status</Link>
        </article>
        <article className="card p-5">
          <p className="text-sm text-slate-400">Your squads</p>
          <h2 className="mt-2 text-xl font-bold text-white">{loading ? '...' : teams.length}</h2>
          <Link to="/my-teams" className="mt-4 inline-flex text-sm font-medium text-brand-300 hover:text-white">Manage teams</Link>
        </article>
        <article className="card p-5">
          <p className="text-sm text-slate-400">Team invitations</p>
          <h2 className="mt-2 text-xl font-bold text-white">{loading ? '...' : incomingRequests.length}</h2>
          <Link to="/notifications" className="mt-4 inline-flex text-sm font-medium text-brand-300 hover:text-white">Review invitations</Link>
        </article>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Your teams</h2>
              <p className="mt-1 text-sm text-slate-400">Jump back into a squad lobby or its chat.</p>
            </div>
            <Link to="/my-teams" className="text-sm font-semibold text-brand-300 hover:text-brand-200">View all</Link>
          </div>
          {loading ? (
            <p className="mt-5 text-sm text-slate-400">Loading your teams...</p>
          ) : teams.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-5">
              <p className="font-medium text-slate-200">No squads yet</p>
              <p className="mt-1 text-sm text-slate-400">Find players or join a lobby with its code.</p>
              <Link to="/find-gamers" className="mt-4 inline-flex text-sm font-semibold text-brand-300">Find gamers →</Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {teams.slice(0, 3).map((team) => (
                <article key={team._id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{team.game} squad</h3>
                    <p className="mt-1 text-sm text-slate-400">{getTeamSize(team)} / {team.maxPlayers || 4} players</p>
                  </div>
                  <Link to={`/chat/${team._id}`} className="rounded-lg border border-slate-700 px-3 py-2 text-center text-sm font-medium text-slate-200 hover:border-brand-500">
                    Open team chat
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Incoming requests</h2>
              <p className="mt-1 text-sm text-slate-400">Players looking to team up with you.</p>
            </div>
            <Link to="/notifications" className="text-sm font-semibold text-brand-300 hover:text-brand-200">Open</Link>
          </div>
          {loading ? (
            <p className="mt-5 text-sm text-slate-400">Loading requests...</p>
          ) : incomingRequests.length === 0 ? (
            <p className="mt-5 rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">You’re all caught up. New team requests will appear here.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {incomingRequests.slice(0, 4).map((request) => (
                <li key={request._id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="font-medium text-white">{request.sender?.username || 'A gamer'} invited you</p>
                  <p className="mt-1 text-sm text-slate-400">For {request.game}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

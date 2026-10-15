import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import { useAuth } from '../context/AuthContext';
import { getMyTeams } from '../services/teamService';

const getMemberList = (team) => [...new Map(
  [team?.leader, ...(team?.members || [])]
    .filter(Boolean)
    .map((member) => [String(member._id || member), member])
).values()];

const Chat = () => {
  const { teamId: routeTeamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchTeams = async () => {
      try {
        const response = await getMyTeams();
        if (active) setTeams(response.data || []);
      } catch (loadError) {
        console.error('Unable to load teams for chat', loadError);
        if (active) setError(loadError.response?.data?.message || 'Unable to load your squads.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTeams();
    return () => { active = false; };
  }, []);

  const activeTeam = teams.find((team) => String(team._id) === String(routeTeamId)) || (!routeTeamId ? teams[0] : null);
  const members = getMemberList(activeTeam);

  return (
    <section className="flex min-h-[65vh] overflow-hidden border border-[#262932] bg-[#1e1f22] text-[#dbdee1] shadow-2xl">
      <aside className="flex w-60 shrink-0 flex-col border-r border-[#17181b] bg-[#2b2d31] max-sm:w-16" aria-label="Squads">
        <div className="flex h-[4.25rem] items-center border-b border-[#202127] px-4 max-sm:justify-center max-sm:px-2">
          <Link to="/my-teams" className="truncate font-bold text-white hover:text-brand-300 max-sm:hidden">GameMate Squads</Link>
          <Link to="/my-teams" aria-label="Browse squads" className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 font-black text-black max-sm:flex">G</Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-2 flex items-center justify-between px-1 max-sm:justify-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#949ba4] max-sm:hidden">Your squads</p>
            <Link to="/my-teams" className="text-lg leading-none text-[#949ba4] hover:text-white" aria-label="Manage squads" title="Manage squads">+</Link>
          </div>
          {loading ? (
            <p className="px-1 py-3 text-sm text-[#949ba4] max-sm:hidden">Loading squads...</p>
          ) : teams.map((team) => {
            const selected = String(team._id) === String(activeTeam?._id);
            return (
              <button
                key={team._id}
                type="button"
                onClick={() => navigate(`/chat/${team._id}`)}
                aria-current={selected ? 'page' : undefined}
                title={`${team.game} squad`}
                className={`mb-1 flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors ${
                  selected ? 'bg-[#404249] text-white' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-white'
                } max-sm:justify-center max-sm:px-1`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl font-bold transition-all ${
                  selected ? 'rounded-xl bg-brand-500 text-black' : 'bg-[#1e1f22] text-brand-300'
                }`}>
                  {(team.game || 'S').charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium max-sm:hidden">{team.game} squad</span>
              </button>
            );
          })}
          {!loading && !teams.length && !error && (
            <div className="mt-3 px-1 text-sm text-[#949ba4] max-sm:hidden">
              No squads yet. <Link to="/my-teams" className="text-brand-300 hover:underline">Find or create one</Link>.
            </div>
          )}
          {error && <p role="alert" className="px-1 py-3 text-sm text-red-300 max-sm:hidden">{error}</p>}
        </div>
        <div className="flex items-center gap-2 border-t border-[#202127] bg-[#232428] p-3 max-sm:justify-center max-sm:p-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5865f2] font-bold text-white">
            {user?.profileImage ? <img src={user.profileImage} alt="" className="h-full w-full object-cover" /> : user?.username?.charAt(0)?.toUpperCase() || 'G'}
          </span>
          <div className="min-w-0 max-sm:hidden">
            <p className="truncate text-sm font-semibold text-white">{user?.username || 'Gamer'}</p>
            <p className="text-xs text-[#949ba4]">Your account</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1">
        {activeTeam ? (
          <>
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex h-[4.25rem] shrink-0 items-center gap-3 border-b border-[#17181b] px-5">
                <span aria-hidden="true" className="text-2xl font-light text-[#949ba4]">#</span>
                <div className="min-w-0">
                  <h1 className="truncate font-bold text-white">{activeTeam.game} squad</h1>
                  <p className="truncate text-xs text-[#949ba4]">Team chat · {members.length} {members.length === 1 ? 'member' : 'members'}</p>
                </div>
                {activeTeam.lobbyCode && <span className="ml-auto hidden border border-[#3b3d44] px-2 py-1 font-mono text-xs text-[#b5bac1] sm:inline-block">Lobby {activeTeam.lobbyCode}</span>}
              </header>
              <ChatBox teamId={activeTeam._id} team={activeTeam} />
            </div>
            <aside className="hidden w-56 shrink-0 border-l border-[#17181b] bg-[#2b2d31] p-4 lg:block" aria-label="Squad members">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#949ba4]">Members — {members.length}</h2>
              <ul className="space-y-1">
                {members.map((member) => {
                  const isLeader = String(member._id || member) === String(activeTeam.leader?._id || activeTeam.leader);
                  return (
                    <li key={member._id || member} className="flex min-w-0 items-center gap-2 rounded px-2 py-2 hover:bg-[#35373c]">
                      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5865f2] text-xs font-bold text-white">
                        {member.profileImage ? <img src={member.profileImage} alt="" className="h-full w-full object-cover" /> : (member.username || 'P').charAt(0).toUpperCase()}
                        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#2b2d31] ${member.gamingStatus === 'Offline' ? 'bg-[#80848e]' : 'bg-[#23a559]'}`} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-[#dbdee1]">{member.username || 'Player'}</span>
                      {isLeader && <span title="Squad leader" className="text-xs text-brand-300">★</span>}
                    </li>
                  );
                })}
              </ul>
            </aside>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            {error ? (
              <p role="alert" className="text-sm text-red-300">{error}</p>
            ) : loading ? (
              <p className="text-sm text-[#949ba4]">Loading your squads...</p>
            ) : routeTeamId ? (
              <>
                <h1 className="text-xl font-bold text-white">Squad not found</h1>
                <p className="mt-2 text-sm text-[#949ba4]">This squad may no longer be available to you.</p>
                <button type="button" onClick={() => navigate('/chat')} className="mt-4 rounded bg-brand-500 px-4 py-2 text-sm font-bold text-black hover:bg-brand-400">Open another squad</button>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white">No squad selected</h1>
                <p className="mt-2 text-sm text-[#949ba4]">Join or create a squad to start chatting.</p>
                <Link to="/my-teams" className="mt-4 rounded bg-brand-500 px-4 py-2 text-sm font-bold text-black hover:bg-brand-400">Browse squads</Link>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Chat;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getMyTeams,
  joinTeamByLobbyCode,
  leaveTeam,
  transferTeamLeadership,
} from '../services/teamService';

const MyTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [selectedLeaders, setSelectedLeaders] = useState({});
  const [busyTeamId, setBusyTeamId] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadTeams = async () => {
    setLoading(true);

    try {
      const response = await getMyTeams();
      setTeams(response.data || []);
    } catch (error) {
      console.error('Unable to load teams', error);
      setTeams([]);
      setFeedback(error.response?.data?.message || 'Unable to load your teams right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleLeave = async (teamId) => {
    if (!window.confirm('Leave this team?')) {
      return;
    }

    setFeedback('');
    try {
      await leaveTeam(teamId);
      await loadTeams();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to leave this team right now.');
    }
  };

  const handleShareLobbyCode = async (team) => {
    try {
      await navigator.clipboard.writeText(team.lobbyCode);
      setCopiedCode(team._id);
      setTimeout(() => setCopiedCode(''), 1600);
    } catch (error) {
      setFeedback('Could not access the clipboard. Copy the lobby code directly.');
    }
  };

  const handleJoinTeam = async (event) => {
    event.preventDefault();
    setFeedback('');

    try {
      await joinTeamByLobbyCode(lobbyCode);
      setLobbyCode('');
      setFeedback('You joined the team lobby.');
      await loadTeams();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to join this lobby right now.');
    }
  };

  const handleTransferLeadership = async (teamId) => {
    const memberId = selectedLeaders[teamId];
    if (!memberId) {
      setFeedback('Choose a team member before transferring leadership.');
      return;
    }

    setBusyTeamId(teamId);
    setFeedback('');
    try {
      await transferTeamLeadership(teamId, memberId);
      setFeedback('Team leadership transferred.');
      await loadTeams();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to transfer team leadership.');
    } finally {
      setBusyTeamId('');
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Your squads</p>
          <h1 className="mt-2 text-3xl font-bold text-white">My Teams</h1>
          <p className="mt-2 text-slate-400">Share a lobby code to bring your squad together, or join a teammate's lobby.</p>
        </div>
        <form onSubmit={handleJoinTeam} className="flex w-full gap-2 sm:max-w-md">
          <label className="sr-only" htmlFor="lobby-code">Lobby code</label>
          <input
            id="lobby-code"
            value={lobbyCode}
            onChange={(event) => setLobbyCode(event.target.value.toUpperCase())}
            placeholder="Enter 10-character code"
            maxLength={10}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm uppercase tracking-widest text-white placeholder:normal-case placeholder:tracking-normal"
          />
          <button type="submit" disabled={lobbyCode.trim().length !== 10} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50">
            Join lobby
          </button>
        </form>
      </section>

      {feedback && <p role="status" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200">{feedback}</p>}

      {loading ? (
        <div className="text-slate-300">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="card p-6 text-slate-300">You are not in any active teams yet.</div>
      ) : (
        teams.map((team) => {
          const leaderId = team.leader?._id || team.leader;
          const memberList = [...new Map(
            [team.leader, ...(team.members || [])]
              .filter(Boolean)
              .map((member) => [member._id || member, member])
          ).values()];
          const teamSize = memberList.length;
          const isLeader = leaderId === user?._id;
          const transferableMembers = memberList.filter((member) => (member._id || member) !== leaderId);

          return (
            <div key={team._id} className="card p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{team.game} Squad</h2>
                  <p className="mt-2 text-slate-400">
                    {teamSize} / {team.maxPlayers || 4} players · Led by {team.leader?.username || 'your team'}
                  </p>
                </div>
                <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-sm text-brand-200">
                  Lobby: <span className="font-mono font-bold tracking-widest">{team.lobbyCode}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {memberList.map((member) => (
                  <span key={member._id || member} className="rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs text-slate-200">
                    {member.username || 'Player'}{(member._id || member) === leaderId ? ' · Leader' : ''}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link to={`/chat/${team._id}`} className="rounded-xl bg-brand-600 px-4 py-2 text-sm text-white">
                  Chat
                </Link>
                <button
                  type="button"
                  onClick={() => handleShareLobbyCode(team)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white"
                >
                  {copiedCode === team._id ? 'Copied!' : 'Share Lobby Code'}
                </button>
                {isLeader && transferableMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <label className="sr-only" htmlFor={`leader-${team._id}`}>New team leader</label>
                    <select
                      id={`leader-${team._id}`}
                      value={selectedLeaders[team._id] || ''}
                      onChange={(event) => setSelectedLeaders({ ...selectedLeaders, [team._id]: event.target.value })}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                    >
                      <option value="">Transfer leadership...</option>
                      {transferableMembers.map((member) => (
                        <option key={member._id || member} value={member._id || member}>{member.username || 'Player'}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!selectedLeaders[team._id] || busyTeamId === team._id}
                      onClick={() => handleTransferLeadership(team._id)}
                      className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busyTeamId === team._id ? 'Transferring...' : 'Transfer leader'}
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleLeave(team._id)}
                  className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300"
                >
                  Leave Team
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyTeams;

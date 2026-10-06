import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTeamById } from '../services/teamService';

const TeamDetails = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadTeam = async () => {
      try {
        const response = await getTeamById(teamId);
        if (active) setTeam(response.data);
      } catch (loadError) {
        if (active) setError(loadError.response?.data?.message || 'Unable to load this squad.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTeam();
    return () => { active = false; };
  }, [teamId]);

  if (loading) return <p className="card p-6 text-slate-300">Loading squad details...</p>;
  if (error || !team) {
    return (
      <section className="card p-6">
        <h1 className="text-2xl font-bold text-white">Squad unavailable</h1>
        <p role="alert" className="mt-2 text-sm text-red-300">{error || 'This squad could not be found.'}</p>
        <Link to="/my-teams" className="mt-4 inline-flex text-sm font-semibold text-brand-300 hover:text-white">Back to squads</Link>
      </section>
    );
  }

  const members = [...new Map(
    [team.leader, ...(team.members || [])]
      .filter(Boolean)
      .map((member) => [member._id || member, member])
  ).values()];
  const leaderId = team.leader?._id || team.leader;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="border border-[#30291f] bg-[#111111] p-6 sm:p-8">
        <p className="mono text-xs uppercase tracking-[0.22em] text-brand-300">Squad details</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="text-3xl font-black uppercase text-white">{team.game} squad</h1>
            <p className="mt-2 text-sm text-slate-400">Led by {team.leader?.username || 'Squad leader'} · {members.length} / {team.maxPlayers || 4} players</p>
          </div>
          <span className={`border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${team.status === 'active' ? 'border-brand-400/40 bg-brand-400/10 text-brand-300' : 'border-danger-500/40 bg-danger-500/10 text-red-300'}`}>
            {team.status}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-800 pt-5">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Lobby code</p>
            <p className="mt-1 font-mono text-xl font-bold tracking-[0.2em] text-white">{team.lobbyCode}</p>
          </div>
          <Link to={`/chat/${team._id}`} className="border border-brand-400 bg-brand-400 px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:-translate-y-0.5 hover:bg-brand-300">
            Open squad chat
          </Link>
        </div>
      </header>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-white">Squad roster</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {members.map((member) => {
            const memberId = member._id || member;
            const username = member.username || 'Player';
            return (
              <li key={memberId} className="flex items-center justify-between gap-3 border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#ff1744]/40 bg-[#171717] font-bold text-[#ffd2da]">
                    {username.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{username}</p>
                    <p className="text-xs text-slate-500">{member.gamingStatus || 'Status unavailable'}</p>
                  </div>
                </div>
                {String(memberId) === String(leaderId) ? (
                  <span className="mono text-[10px] uppercase tracking-wider text-brand-300">Leader</span>
                ) : (
                  <Link to={`/gamer/${memberId}`} className="text-xs font-semibold uppercase tracking-wider text-[#ff9aad] hover:text-white">Profile</Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <Link to="/my-teams" className="inline-flex text-sm font-semibold text-slate-400 hover:text-white">← Back to all squads</Link>
    </div>
  );
};

export default TeamDetails;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyTeams, leaveTeam } from '../services/teamService';

const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = async () => {
    setLoading(true);

    try {
      const response = await getMyTeams();
      setTeams(response.data || []);
    } catch (error) {
      console.error('Unable to load teams', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleLeave = async (teamId) => {
    try {
      await leaveTeam(teamId);
      loadTeams();
    } catch (error) {
      console.error('Unable to leave team', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">My Teams</h1>

      {loading ? (
        <div className="text-slate-300">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="card p-6 text-slate-300">You are not in any active teams yet.</div>
      ) : (
        teams.map((team) => (
          <div key={team._id} className="card p-6">
            <h2 className="text-2xl font-bold text-white">{team.game} Squad</h2>
            <p className="mt-2 text-slate-400">{team.members.length + 1} / {team.maxPlayers} Players</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={`/chat/${team._id}`} className="rounded-xl bg-brand-600 px-4 py-2 text-sm text-white">
                Chat
              </Link>
              <button className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white">
                Share Lobby Code
              </button>
              <button
                type="button"
                onClick={() => handleLeave(team._id)}
                className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300"
              >
                Leave Team
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyTeams;

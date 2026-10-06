import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGamerById } from '../services/gamerService';
import { sendTeamRequest } from '../services/teamService';

const GamerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [gamer, setGamer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      setFeedback('');
      try {
        const response = await getGamerById(id);
        if (active) setGamer(response.data);
      } catch (error) {
        if (active) {
          setGamer(null);
          setFeedback(error.response?.data?.message || 'Unable to load this gamer profile.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => { active = false; };
  }, [id]);

  const handleRequest = async () => {
    const game = gamer?.games?.[0];
    if (!game) {
      setFeedback('This gamer has not added a game yet.');
      return;
    }

    setRequesting(true);
    setFeedback('');
    try {
      await sendTeamRequest({
        receiverId: gamer._id,
        game,
        message: `Hi ${gamer.username}, I would like to team up for ${game}.`,
      });
      setFeedback(`Team request sent for ${game}.`);
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to send a team request right now.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <div className="card mx-auto max-w-3xl p-8 text-slate-300">Loading gamer profile...</div>;
  }

  if (!gamer) {
    return (
      <section className="card mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-bold text-white">Profile unavailable</h1>
        <p role="status" className="mt-3 text-slate-300">{feedback}</p>
        <Link to="/find-gamers" className="mt-6 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          Back to gamers
        </Link>
      </section>
    );
  }

  const isOwnProfile = user?._id === gamer._id;
  const games = gamer.games || [];
  const languages = gamer.preferredLanguages || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
        <div className="h-28 bg-gradient-to-r from-brand-700 via-indigo-700 to-slate-800" />
        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {gamer.profileImage ? (
                <img src={gamer.profileImage} alt="" className="h-24 w-24 rounded-2xl border-4 border-slate-900 object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-slate-900 bg-brand-600 text-3xl font-bold text-white">
                  {gamer.username?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div className="pb-1">
                <h1 className="text-3xl font-bold text-white">{gamer.username}</h1>
                <p className="mt-1 text-sm text-slate-400">{gamer.skillLevel || 'Gamer'}</p>
              </div>
            </div>
            {isOwnProfile ? (
              <Link to="/settings" className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-center text-sm font-semibold text-white hover:border-brand-500">
                Edit profile
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleRequest}
                disabled={requesting || games.length === 0}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {requesting ? 'Sending request...' : 'Request to team up'}
              </button>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">{gamer.gamingStatus || 'Online'}</span>
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {gamer.microphoneAvailable ? 'Microphone available' : 'No microphone listed'}
            </span>
          </div>
          {gamer.bio ? (
            <p className="mt-6 whitespace-pre-wrap leading-relaxed text-slate-300">{gamer.bio}</p>
          ) : (
            <p className="mt-6 text-slate-500">No bio added yet.</p>
          )}
          {feedback && <p role="status" className="mt-4 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">{feedback}</p>}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-white">Favorite games</h2>
          {games.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {games.map((game) => <li key={game} className="rounded-xl border border-brand-500/20 bg-brand-500/10 px-3 py-2 text-sm text-brand-100">{game}</li>)}
            </ul>
          ) : <p className="mt-3 text-sm text-slate-400">No games listed yet.</p>}
        </section>
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-white">Languages</h2>
          {languages.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {languages.map((language) => <li key={language} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200">{language}</li>)}
            </ul>
          ) : <p className="mt-3 text-sm text-slate-400">No preferred languages listed.</p>}
        </section>
      </div>
    </div>
  );
};

export default GamerProfile;

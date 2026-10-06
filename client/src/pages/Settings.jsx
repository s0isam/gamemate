import { useEffect, useState } from 'react';
import { getProfile, updateLocation, updateProfile, updateStatus } from '../services/gamerService';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    games: '',
    preferredLanguages: '',
    microphoneAvailable: false,
    gamingStatus: 'Looking for Team',
    skillLevel: 'Intermediate',
  });
  const [locationData, setLocationData] = useState({ latitude: '', longitude: '' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const profile = response.data;
        setFormData({
          username: profile.username || '',
          bio: profile.bio || '',
          games: Array.isArray(profile.games) ? profile.games.join(', ') : '',
          preferredLanguages: Array.isArray(profile.preferredLanguages) ? profile.preferredLanguages.join(', ') : '',
          microphoneAvailable: Boolean(profile.microphoneAvailable),
          gamingStatus: profile.gamingStatus || 'Looking for Team',
          skillLevel: profile.skillLevel || 'Intermediate',
        });
      } catch (error) {
        console.error('Unable to load profile', error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setFeedback('Location access is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFeedback('Location captured. Save your profile to update nearby discovery.');
        setLocationData({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
      },
      (error) => {
        setFeedback(error.message || 'Location permission was denied.');
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback('');

    try {
      const payload = {
        username: formData.username,
        bio: formData.bio,
        games: formData.games.split(',').map((item) => item.trim()).filter(Boolean),
        preferredLanguages: formData.preferredLanguages.split(',').map((item) => item.trim()).filter(Boolean),
        microphoneAvailable: formData.microphoneAvailable,
        skillLevel: formData.skillLevel,
      };

      const profileResponse = await updateProfile(payload);
      const statusResponse = await updateStatus(formData.gamingStatus);

      if (locationData.latitude && locationData.longitude) {
        await updateLocation(Number(locationData.latitude), Number(locationData.longitude));
      }

      setUser({ ...profileResponse.data, gamingStatus: statusResponse.data.gamingStatus });
      setFeedback('Profile saved.');
    } catch (error) {
      console.error('Profile update failed', error);
      setFeedback(error.response?.data?.message || 'Profile update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-none border border-[#30303A] bg-[#11151C] p-8">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <p className="mt-2 text-sm text-slate-400">Manage your player identity, games, availability and discovery location.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm text-slate-300 md:col-span-1">
            <span className="mb-2 block">Username</span>
            <input
              value={formData.username}
              onChange={(event) => setFormData({ ...formData, username: event.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
            />
          </label>
          <label className="block text-sm text-slate-300 md:col-span-1">
            <span className="mb-2 block">Skill Level</span>
            <select
              value={formData.skillLevel}
              onChange={(event) => setFormData({ ...formData, skillLevel: event.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Pro</option>
            </select>
          </label>
          <label className="block text-sm text-slate-300 md:col-span-2">
            <span className="mb-2 block">Bio</span>
            <textarea
              value={formData.bio}
              onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
              className="h-28 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
            />
          </label>
          <label className="block text-sm text-slate-300 md:col-span-1">
            <span className="mb-2 block">Games</span>
            <input
              value={formData.games}
              onChange={(event) => setFormData({ ...formData, games: event.target.value })}
              placeholder="Among Us, Valorant"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
            />
          </label>
          <label className="block text-sm text-slate-300 md:col-span-1">
            <span className="mb-2 block">Preferred Languages</span>
            <input
              value={formData.preferredLanguages}
              onChange={(event) => setFormData({ ...formData, preferredLanguages: event.target.value })}
              placeholder="English, Telugu"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
            />
          </label>
          <label className="block text-sm text-slate-300 md:col-span-1">
            <span className="mb-2 block">Gaming Status</span>
            <select
              value={formData.gamingStatus}
              onChange={(event) => setFormData({ ...formData, gamingStatus: event.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
            >
              <option>Online</option>
              <option>Looking for Team</option>
              <option>In Game</option>
              <option>Offline</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-300 md:col-span-1">
            <input
              type="checkbox"
              checked={formData.microphoneAvailable}
              onChange={(event) => setFormData({ ...formData, microphoneAvailable: event.target.checked })}
              className="h-4 w-4 accent-brand-600"
            />
            Microphone available
          </label>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Location</h2>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:border-brand-500"
            >
              Use My Location
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Latitude</span>
              <input
                value={locationData.latitude}
                onChange={(event) => setLocationData({ ...locationData, latitude: event.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white"
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Longitude</span>
              <input
                value={locationData.longitude}
                onChange={(event) => setLocationData({ ...locationData, longitude: event.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white"
              />
            </label>
          </div>
        </div>

        {feedback && <p role="status" className="border border-[#ff1744]/35 bg-[#ff1744]/10 px-4 py-3 text-sm text-red-200">{feedback}</p>}
        <button type="submit" disabled={saving} className="rounded-xl bg-brand-600 px-5 py-3 font-bold text-black hover:bg-brand-500 disabled:opacity-70">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Settings;

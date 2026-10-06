import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerUser(formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-[#3d2a26] bg-[#111111]/95 p-8 shadow-[0_0_0_1px_rgba(255,23,68,0.08),0_0_22px_rgba(255,23,68,0.08)]">
      <h1 className="text-3xl font-bold text-white">Create your profile</h1>
      <p className="mt-2 text-sm text-slate-400">Join the GameMate community and start matching.</p>

      <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-300 md:col-span-1">
          <span className="mb-2 block">Username</span>
          <input
            value={formData.username}
            onChange={(event) => setFormData({ ...formData, username: event.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-1">
          <span className="mb-2 block">Email</span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          <span className="mb-2 block">Password</span>
          <input
            type="password"
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          <span className="mb-2 block">Bio</span>
          <textarea
            value={formData.bio}
            onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
            className="h-24 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />
        </label>

        {error && <p className="md:col-span-2 text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="md:col-span-2 w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-black hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already a player?{' '}
        <Link to="/login" className="radiant-red font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;

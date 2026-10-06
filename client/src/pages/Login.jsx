import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-[#3d2a26] bg-[#111111]/95 p-8 shadow-[0_0_0_1px_rgba(255,23,68,0.08),0_0_22px_rgba(255,23,68,0.08)]">
      <h1 className="text-3xl font-bold text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-400">Log in with the email and password you used to create your account.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-300">
          <span className="mb-2 block">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />
        </label>
        <label className="block text-sm text-slate-300">
          <span className="mb-2 block">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />
        </label>

        {error && <p role="alert" className="border border-danger-500/40 bg-danger-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-black hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don’t have an account?{' '}
        <Link to="/register" className="radiant-red font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;

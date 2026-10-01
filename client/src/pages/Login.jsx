import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-400">Log in to find your next squad.</p>

      <form className="mt-8 space-y-5">
        <label className="block text-sm text-slate-300">
          <span className="mb-2 block">Email</span>
          <input type="email" defaultValue="demo@gamemate.app" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
        </label>
        <label className="block text-sm text-slate-300">
          <span className="mb-2 block">Password</span>
          <input type="password" defaultValue="password123" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
        </label>

        <button type="submit" className="w-full rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-500">
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don’t have an account?{' '}
        <Link to="/register" className="text-brand-300">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;

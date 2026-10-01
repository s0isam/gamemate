import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-white">Create your profile</h1>
      <p className="mt-2 text-sm text-slate-400">Join the GameMate community and start matching.</p>

      <form className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-slate-300 md:col-span-1">
          <span className="mb-2 block">Username</span>
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-1">
          <span className="mb-2 block">Email</span>
          <input type="email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          <span className="mb-2 block">Password</span>
          <input type="password" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          <span className="mb-2 block">Bio</span>
          <textarea className="h-24 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
        </label>

        <button type="submit" className="md:col-span-2 w-full rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-500">
          Register
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already a player?{' '}
        <Link to="/login" className="text-brand-300">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;

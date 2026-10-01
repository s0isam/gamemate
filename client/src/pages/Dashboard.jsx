const Dashboard = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-3xl font-bold text-white">Welcome back, Narendra 👋</h1>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article className="card p-5">
          <p className="text-sm text-slate-400">Current Game</p>
          <h3 className="mt-3 text-2xl font-bold text-white">Among Us</h3>
          <button className="mt-5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">
            Find Teammates
          </button>
        </article>

        <article className="card p-5">
          <p className="text-sm text-slate-400">Looking for Team</p>
          <h3 className="mt-3 text-2xl font-bold text-emerald-300">Visible to nearby gamers</h3>
          <button className="mt-5 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:border-slate-500">
            Stop Looking
          </button>
        </article>

        <article className="card p-5">
          <p className="text-sm text-slate-400">My Teams</p>
          <h3 className="mt-3 text-2xl font-bold text-white">Among Us Squad</h3>
          <p className="mt-2 text-sm text-slate-400">3 / 4 players</p>
          <button className="mt-5 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
            Open Team
          </button>
        </article>

        <article className="card p-5">
          <p className="text-sm text-slate-400">Notifications</p>
          <h3 className="mt-3 text-2xl font-bold text-white">2 new requests</h3>
        </article>
      </div>
    </div>
  );
};

export default Dashboard;

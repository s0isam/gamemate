const GamerProfile = () => {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">
          R
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Rahul</h1>
          <p className="text-slate-400">Among Us • Telugu • 🎤 Mic available</p>
        </div>
      </div>

      <p className="mt-6 text-slate-300">
        Looking for a relaxed but competitive teammate for ranked and casual squads.
      </p>
    </div>
  );
};

export default GamerProfile;

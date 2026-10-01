const Settings = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <div className="space-y-4">
        <div className="card p-4">
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>
        <div className="card p-4">
          <h2 className="text-lg font-semibold text-white">Privacy</h2>
        </div>
      </div>
    </div>
  );
};

export default Settings;

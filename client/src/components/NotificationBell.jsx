const NotificationBell = () => {
  return (
    <button className="relative rounded-xl border border-slate-700 bg-slate-900 p-2 text-lg text-slate-100 hover:border-brand-500">
      🔔
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
        3
      </span>
    </button>
  );
};

export default NotificationBell;

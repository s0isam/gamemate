const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#070707] py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="font-medium text-slate-300">© 2026 GameMate. Built for gamers who want to play together.</p>
        <div className="mono flex gap-4 text-[10px] uppercase tracking-[0.24em] text-slate-500">
          <span>Privacy</span>
          <span>Safety</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

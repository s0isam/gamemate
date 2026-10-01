const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 GameMate. Built for gamers who want to play together.</p>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Safety</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'react-router-dom';

const gameMarks = {
  'Among Us': { mark: 'AU', accent: '#FF1744' },
  'Apex Legends': { mark: 'APEX', accent: '#FF6B00' },
  BGMI: { mark: 'BGMI', accent: '#FFE600' },
  'Call of Duty': { mark: 'COD', accent: '#FF1744' },
  Fortnite: { mark: 'FN', accent: '#00A8FF' },
  'Free Fire': { mark: 'FF', accent: '#FF6B00' },
  'GTA V': { mark: 'V', accent: '#39FF14' },
  Minecraft: { mark: 'M', accent: '#39FF14' },
  PUBG: { mark: 'PUBG', accent: '#FFE600' },
  Valorant: { mark: 'V', accent: '#FF1744' },
};

const GameCard = ({ name, description, category }) => {
  const mark = gameMarks[name] || {
    mark: name.split(/\s+/).map((word) => word[0]).join('').slice(0, 4).toUpperCase(),
    accent: '#FFE600',
  };

  return (
    <article className="relative flex h-full flex-col overflow-hidden border border-[#30303A] bg-[#11151C] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-brand-400/70 hover:shadow-[0_0_20px_rgba(255,230,0,0.16)]">
      <div
        role="img"
        aria-label={`${name} logo`}
        className="mb-4 flex h-32 flex-col items-center justify-center gap-1 border bg-[linear-gradient(145deg,#1B2029,#080A0F)]"
        style={{
          borderColor: `${mark.accent}66`,
          backgroundImage: `radial-gradient(circle at 50% 0, ${mark.accent}24, transparent 72%), linear-gradient(145deg, #1B2029, #080A0F)`,
        }}
      >
        <span className="font-display text-4xl font-black leading-none tracking-[-0.08em]" style={{ color: mark.accent, textShadow: `0 0 24px ${mark.accent}55` }}>
          {mark.mark}
        </span>
        <span className="mono mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">{name}</span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{category}</p>
          <h3 className="mt-2 text-xl font-bold text-white">{name}</h3>
        </div>
        <Link to={`/find-gamers?game=${encodeURIComponent(name)}`} className="border border-brand-400 bg-brand-600 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_0_18px_rgba(255,230,0,0.35)]">
          Explore
        </Link>
      </div>
      <p className="mt-4 text-sm text-slate-300">{description}</p>
    </article>
  );
};

export default GameCard;

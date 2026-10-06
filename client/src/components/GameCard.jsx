import { Link } from 'react-router-dom';

const GameCard = ({ name, description, category, image }) => {
  return (
    <article className="relative flex h-full flex-col overflow-hidden border border-[#30291f] bg-[#111111] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#ff1744]/70 hover:shadow-[0_0_20px_rgba(255,23,68,0.14)]">
      <div className="radiant-red mb-4 flex h-32 items-center justify-center border border-[#ff1744]/45 bg-[linear-gradient(135deg,rgba(223,255,0,0.12),rgba(255,23,68,0.16)_58%,rgba(17,17,17,0.96))] text-2xl font-black">
        {image || name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{category}</p>
          <h3 className="mt-2 text-xl font-bold text-white">{name}</h3>
        </div>
        <Link to={`/find-gamers?game=${encodeURIComponent(name)}`} className="border border-[#ff1744] bg-[#ff1744] px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e5092f] hover:shadow-[0_0_18px_rgba(255,23,68,0.35)]">
          Explore
        </Link>
      </div>
      <p className="mt-4 text-sm text-slate-300">{description}</p>
    </article>
  );
};

export default GameCard;

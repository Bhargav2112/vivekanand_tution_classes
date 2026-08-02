import { Megaphone } from 'lucide-react';

export default function Marquee({ items = [] }) {
  const doubled = [...items, ...items];
  return (
    <div className="bg-primary text-white overflow-hidden border-y border-golden/30">
      <div className="marquee-track py-3">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-8 whitespace-nowrap">
            <Megaphone className="w-4 h-4 text-golden flex-shrink-0" strokeWidth={2} />
            <span className="font-heading text-[15px] font-semibold tracking-wide">{item}</span>
            <span className="text-golden ml-3">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
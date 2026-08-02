import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import Reveal from './Reveal';

export default function PageHero({ title, subtitle, breadcrumb = [], bg = 'primary' }) {
  const bgClass = bg === 'primary' ? 'bg-primary' : bg === 'accent' ? 'bg-accent' : 'bg-secondary';
  return (
    <section className={`${bgClass} text-white relative overflow-hidden pt-[150px] md:pt-[170px] pb-16 md:pb-20`}>
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Decorative shape */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-golden/10 -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 text-center">
        <Reveal>
          {breadcrumb.length > 0 && (
            <nav className="flex items-center justify-center gap-2 mb-5 text-[14px]">
              <Link to="/" className="flex items-center gap-1 text-white/70 hover:text-golden transition-colors">
                <Home className="w-3.5 h-3.5" />
                મુખ્ય પૃષ્ઠ
              </Link>
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                  {b.path ? (
                    <Link to={b.path} className="text-white/70 hover:text-golden transition-colors">{b.label}</Link>
                  ) : (
                    <span className="text-golden font-semibold">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-heading font-extrabold text-3xl md:text-5xl lg:text-[56px] !leading-loose text-balance pb-4 pt-3">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl mx-auto font-body text-[18px] md:text-[20px] leading-[1.7] text-white/80">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
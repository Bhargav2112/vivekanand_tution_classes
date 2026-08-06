import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SITE } from '@/data/site';
import { useTranslation } from 'react-i18next';

export default function Logo({ light = false, className = '' }) {
  const { t } = useTranslation();
  return (
    <Link to="/" className={cn('flex items-center gap-3 group', className)} aria-label={SITE.name}>
      <div
        className={cn(
          'flex items-center justify-center w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-full border-2 overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105',
          light ? 'border-golden bg-golden/20' : 'border-primary bg-primary/10'
        )}
      >
        <img
          src="/logo.png"
          alt={SITE.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="leading-[1.3]">
        <div
          className={cn(
            'font-heading font-bold text-[17px] md:text-[18px] tracking-tight',
            light ? 'text-white' : 'text-primary'
          )}
        >
          {SITE.name}
        </div>
        <div
          className={cn(
            'font-body text-[12px] md:text-[13px] mt-0.5',
            light ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          {t('header.tagline')}
        </div>
      </div>
    </Link>
  );
}
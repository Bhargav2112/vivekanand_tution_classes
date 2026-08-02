import { cn } from '@/lib/utils';

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {label && (
        <div
          className={cn(
            'inline-flex items-center gap-2 mb-4',
            align === 'center' && 'justify-center'
          )}
        >
          <span className="block w-8 h-[2px] bg-accent" />
          <span
            className={cn(
              'font-heading text-[15px] font-bold uppercase tracking-[2px]',
              light ? 'text-golden' : 'text-accent'
            )}
          >
            {label}
          </span>
          <span className="block w-8 h-[2px] bg-accent" />
        </div>
      )}
      {title && (
        <h2
          className={cn(
            'font-heading font-extrabold leading-[1.5] md:leading-[1.45] text-balance pb-1',
            light ? 'text-white' : 'text-foreground',
            align === 'center' ? 'text-3xl md:text-[42px] lg:text-[48px]' : 'text-3xl md:text-4xl lg:text-[44px]'
          )}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={cn(
            'mt-5 text-lg md:text-[21px] leading-[1.8] max-w-2xl',
            align === 'center' && 'mx-auto',
            light ? 'text-white/80' : 'text-muted-foreground'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
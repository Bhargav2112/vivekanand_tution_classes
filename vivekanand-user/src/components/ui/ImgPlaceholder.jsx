import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImgPlaceholder({
  label = 'છબી',
  ratio = '4/5',
  className = '',
  iconClassName = '',
  dark = false,
  showLabel = true,
}) {
  return (
    <div
      className={cn(
        'relative w-full flex items-center justify-center overflow-hidden border',
        dark
          ? 'bg-primary/10 border-primary/20'
          : 'bg-muted border-border',
        className
      )}
      style={{ aspectRatio: ratio }}
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-3 p-4 text-center">
        <ImageIcon
          className={cn(
            'w-10 h-10',
            dark ? 'text-primary' : 'text-muted-foreground',
            iconClassName
          )}
          strokeWidth={1.5}
        />
        {showLabel && (
          <span
            className={cn(
              'font-heading text-sm font-semibold tracking-wide',
              dark ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
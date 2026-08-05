import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-[#D96D00] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(245,124,0,0.35)]',
  secondary: 'bg-white text-accent border-2 border-accent hover:bg-accent hover:text-white',
  maroon: 'bg-primary text-white hover:bg-[#68090E] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(122,14,19,0.35)]',
  golden: 'bg-golden text-white hover:bg-[#C9910F] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(230,168,23,0.35)]',
  outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
  white: 'bg-white text-primary hover:bg-muted hover:-translate-y-0.5',
};

const SIZES = {
  sm: 'h-11 px-5 text-[15px]',
  md: 'h-[58px] px-9 text-[18px]',
  lg: 'h-16 px-10 text-[20px]',
};

export default function Btn({
  children,
  to = undefined,
  href = undefined,
  onClick = undefined,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon = undefined,
  iconRight: IconRight = undefined,
  fullWidth = false,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2.5 font-heading font-bold tracking-[0.2px] transition-all duration-250 ease-out select-none whitespace-nowrap',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />}
      <span>{children}</span>
      {IconRight && <IconRight className="w-5 h-5 flex-shrink-0" strokeWidth={2} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={classes} onClick={onClick} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button className={classes} onClick={onClick} {...props}>
      {content}
    </button>
  );
}
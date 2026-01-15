import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark';
}

export function Logo({ className, variant = 'full', theme = 'dark' }: LogoProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-navy-950';
  const subtextColor = theme === 'dark' ? 'text-white/60' : 'text-navy-950/60';
  const bgColor = theme === 'dark' ? 'bg-white/10' : 'bg-navy-950/10';

  if (variant === 'icon') {
    return (
      <div className={cn('p-2 rounded-xl', bgColor, className)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path
            d="M12 2L2 22H22L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={textColor}
          />
          <path
            d="M12 2L7 12L12 10L17 12L12 2Z"
            fill="currentColor"
            className={textColor}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('p-2 rounded-xl', bgColor)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn('w-8 h-8', textColor)}
        >
          <path
            d="M12 2L2 22H22L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 2L7 12L12 10L17 12L12 2Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={cn('font-display text-xl font-bold uppercase tracking-wider', textColor)}>
          Mountain Goats
        </span>
        <span className={cn('text-xs uppercase tracking-[0.3em]', subtextColor)}>
          CDMX
        </span>
      </div>
    </div>
  );
}

export default Logo;


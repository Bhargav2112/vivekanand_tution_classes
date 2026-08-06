import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { CallIcon, WhatsAppIcon } from '@/components/ui/CustomIcons';
import { SITE } from '@/data/site';
import { cn } from '@/lib/utils';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40 flex flex-col gap-3">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent text-white shadow-lg hover:bg-[#D96D00] transition-all duration-300',
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        aria-label="ઉપર જાઓ"
      >
        <ArrowUp className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
      </button>
      {/* Call */}
      <a
        href={`tel:${SITE.phoneRaw}`}
        className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-white shadow-[0_4px_14px_rgba(0,0,0,0.3)] hover:bg-[#68090E] transition-all duration-300 hover:scale-110"
        aria-label="કોલ કરો"
      >
        <CallIcon className="w-6 h-6 md:w-8 md:h-8" />
      </a>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300 relative group"
        aria-label="WhatsApp"
      >
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
        <WhatsAppIcon className="w-9 h-9 md:w-11 md:h-11 relative z-10 drop-shadow-sm" />
      </a>
    </div>
  );
}